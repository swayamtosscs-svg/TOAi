"""
WhatsApp Web Scraper Module

This module contains the WhatsAppScraper class for interacting with WhatsApp Web.
It provides functionality for:
- Connecting to WhatsApp Web via Selenium
- Opening and navigating WhatsApp groups
- Extracting text messages from chats
- Downloading PDFs from chats
- Downloading images and performing OCR
"""

import os
import re
import time
import glob
import shutil
import base64
import requests

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

from PIL import Image

# Check if Tesseract is available for OCR
try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False


class WhatsAppScraper:
    """
    A class to scrape WhatsApp Web for messages, PDFs, and images.
    
    Attributes:
        driver: Selenium WebDriver instance
        connected: Boolean indicating if connected to WhatsApp Web
        download_dir: Directory for downloading PDFs
        images_dir: Directory for downloading images
    """
    
    def __init__(self, download_dir: str, images_dir: str):
        """
        Initialize the WhatsApp scraper.
        
        Args:
            download_dir: Directory path for downloading PDFs
            images_dir: Directory path for downloading images
        """
        self.driver = None
        self.connected = False
        self.download_dir = download_dir
        self.images_dir = images_dir
        
        # Ensure directories exist
        os.makedirs(self.download_dir, exist_ok=True)
        os.makedirs(self.images_dir, exist_ok=True)

    def start_whatsapp(self):
        """Start WhatsApp Web and wait for QR code scan."""
        chrome_options = Options()
        chrome_options.add_argument("--start-maximized")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])

        prefs = {
            "download.default_directory": self.download_dir,
            "download.prompt_for_download": False,
            "plugins.always_open_pdf_externally": True,
            "profile.default_content_setting_values.notifications": 2,
        }
        chrome_options.add_experimental_option("prefs", prefs)

        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        wait = WebDriverWait(self.driver, 30)

        self.driver.get("https://web.whatsapp.com")

        try:
            wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]')
                )
            )
            self.connected = True
            return True
        except TimeoutException:
            return False

    def start_whatsapp_async(self):
        """
        Start WhatsApp Web without waiting for QR code scan.
        Returns immediately after opening WhatsApp Web.
        """
        chrome_options = Options()
        chrome_options.add_argument("--start-maximized")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])

        prefs = {
            "download.default_directory": self.download_dir,
            "download.prompt_for_download": False,
            "plugins.always_open_pdf_externally": True,
            "profile.default_content_setting_values.notifications": 2,
        }
        chrome_options.add_experimental_option("prefs", prefs)

        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)

        self.driver.get("https://web.whatsapp.com")
        
        # Wait a bit for the page to load
        time.sleep(3)
        return True

    def get_qr_code_base64(self):
        """
        Get the QR code from WhatsApp Web as a base64 encoded image.
        Returns None if QR code is not found or user is already logged in.
        """
        if not self.driver:
            return None
            
        try:
            # Check if already logged in (QR code won't be visible)
            if self.is_logged_in():
                return None
            
            # Try to find the QR code canvas element
            qr_selectors = [
                '//canvas[@aria-label="Scan this QR code to link a device!"]',
                '//canvas[contains(@aria-label, "QR")]',
                '//div[@data-ref]//canvas',
                '//canvas'
            ]
            
            qr_element = None
            for selector in qr_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    for elem in elements:
                        # Check if it's a visible canvas with reasonable size
                        if elem.is_displayed():
                            size = elem.size
                            if size['width'] > 100 and size['height'] > 100:
                                qr_element = elem
                                break
                    if qr_element:
                        break
                except Exception:
                    continue
            
            if not qr_element:
                # Try to find any canvas element that could be the QR code
                canvases = self.driver.find_elements(By.TAG_NAME, 'canvas')
                for canvas in canvases:
                    try:
                        if canvas.is_displayed() and canvas.size['width'] > 100:
                            qr_element = canvas
                            break
                    except Exception:
                        continue
            
            if qr_element:
                # Use JavaScript to get the canvas data as base64
                qr_base64 = self.driver.execute_script(
                    "return arguments[0].toDataURL('image/png');",
                    qr_element
                )
                return qr_base64
            
            return None
            
        except Exception as e:
            print(f"Error getting QR code: {e}")
            return None

    def is_logged_in(self):
        """
        Check if the user has scanned the QR code and is logged in.
        Returns True if logged in, False otherwise.
        """
        if not self.driver:
            return False
            
        try:
            # Check for the search box which appears after login
            search_box = self.driver.find_elements(
                By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]'
            )
            if search_box and len(search_box) > 0:
                self.connected = True
                return True
            
            # Alternative: check for the main chat panel
            chat_panel = self.driver.find_elements(
                By.XPATH, '//div[@id="pane-side"]'
            )
            if chat_panel and len(chat_panel) > 0:
                self.connected = True
                return True
                
            return False
            
        except Exception as e:
            print(f"Error checking login status: {e}")
            return False

    def open_group(self, group_name):
        """Open a WhatsApp group by name."""
        if not self.connected:
            return False

        wait = WebDriverWait(self.driver, 10)

        # --- Locate the global chat search box ---
        search_box = None
        selectors = [
            # Main search bar in most WhatsApp Web layouts
            (By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]'),
            (By.CSS_SELECTOR, 'div[contenteditable="true"][data-tab="3"]'),
        ]

        for by, selector in selectors:
            try:
                search_box = wait.until(
                    EC.presence_of_element_located((by, selector))
                )
                break
            except Exception:
                continue

        if not search_box:
            return False

        # --- Robustly clear the search field before typing the new group ---
        try:
            search_box.click()
            time.sleep(0.5)
            # Some WhatsApp builds ignore .clear(), so send Ctrl+A + Backspace as well
            search_box.clear()
            search_box.send_keys(Keys.CONTROL + "a")
            search_box.send_keys(Keys.BACKSPACE)
            time.sleep(0.5)
        except Exception:
            # Best-effort clearing; continue even if one of the above fails
            pass

        # Type the desired group name
        search_box.send_keys(group_name)
        time.sleep(2)

        # --- Prefer an exact match in the results to avoid "a test" selecting "a test2" ---
        try:
            # WhatsApp normally renders chat titles as <span title="GROUP_NAME">
            exact_match_xpath = f'//span[@title="{group_name}"]'
            exact_match = wait.until(
                EC.element_to_be_clickable((By.XPATH, exact_match_xpath))
            )
            exact_match.click()
        except Exception:
            # Fallback: press ENTER (opens the first result, old behaviour)
            search_box.send_keys(Keys.ENTER)

        time.sleep(3)
        return True

    def list_groups(self, limit: int = 50):
        """
        List visible WhatsApp chats/groups from the left pane.
        Returns a list of unique chat titles (group/contact names).
        """
        if not self.driver:
            return []

        names = []
        try:
            # Pane-side normally contains the chat list; look for title spans
            elements = self.driver.find_elements(By.XPATH, '//div[@id="pane-side"]//span[@title]')
            for elem in elements:
                try:
                    title = elem.get_attribute("title") or ""
                    title = title.strip()
                    if title and title not in names:
                        names.append(title)
                        if len(names) >= limit:
                            break
                except Exception:
                    continue
        except Exception as e:
            print(f"Error listing WhatsApp groups: {e}")

        return names

    def extract_messages(self):
        """Extract text messages from the currently open WhatsApp chat."""
        messages = []

        print("\n==============================")
        print("Extracting messages from chat...")
        print("==============================")

        # Wait for chat to load
        time.sleep(2)

        # Scroll to load messages - use SAME approach as download_images_and_ocr which finds more elements
        try:
            try:
                chat_panel = self.driver.find_element(By.XPATH, '//div[@data-tab="6"]')
            except:
                chat_panel = self.driver.find_element(By.XPATH, '//div[@id="main"]')
            
            print("Scrolling to load messages (matching image extraction scroll)...")
            for i in range(5):
                self.driver.execute_script("arguments[0].scrollTop = arguments[0].scrollTop - 1000", chat_panel)
                time.sleep(1)  # Increased from 0.5 to 1 second to match image extraction
                print(f"  Scrolled {i+1}/5...")
            
            time.sleep(2)  # Added extra wait to match image extraction
        except Exception as e:
            print(f"Scroll failed: {e}")

        # Try multiple selector strategies
        print("\n[DEBUG] Trying multiple message selectors...")
        
        # Strategy 1: Standard message containers
        all_messages = self.driver.find_elements(By.XPATH, 
            '//div[contains(@class, "message-in") or contains(@class, "message-out")] | '
            '//div[@data-id]'
        )
        print(f"[DEBUG] Strategy 1 (message-in/out | data-id): Found {len(all_messages)} elements")
        
        # Strategy 2: Look for copyable-text directly
        if len(all_messages) == 0:
            all_messages = self.driver.find_elements(By.XPATH, 
                '//div[@data-pre-plain-text]'
            )
            print(f"[DEBUG] Strategy 2 (data-pre-plain-text): Found {len(all_messages)} elements")
        
        # Strategy 3: Look for focusable message divs
        if len(all_messages) == 0:
            all_messages = self.driver.find_elements(By.XPATH, 
                '//div[@role="row"]//div[contains(@class, "focusable-list-item")]'
            )
            print(f"[DEBUG] Strategy 3 (focusable-list-item): Found {len(all_messages)} elements")
        
        # Strategy 4: Look for any div with selectable-text inside main
        if len(all_messages) == 0:
            all_messages = self.driver.find_elements(By.XPATH, 
                '//div[@id="main"]//span[contains(@class, "selectable-text")]/..'
            )
            print(f"[DEBUG] Strategy 4 (selectable-text parent): Found {len(all_messages)} elements")
        
        # Strategy 5: Look for chat bubbles by common patterns
        if len(all_messages) == 0:
            all_messages = self.driver.find_elements(By.CSS_SELECTOR, 
                '#main [data-id]'
            )
            print(f"[DEBUG] Strategy 5 (CSS #main [data-id]): Found {len(all_messages)} elements")
        
        print(f"\nTotal message containers found: {len(all_messages)}")

        if not all_messages:
            print("\n[DEBUG] No message containers found with ANY strategy!")
            print("[DEBUG] Attempting to dump page structure...")
            try:
                main_div = self.driver.find_element(By.XPATH, '//div[@id="main"]')
                print(f"[DEBUG] Main div found: {main_div.get_attribute('class')}")
                children = main_div.find_elements(By.XPATH, './div')
                print(f"[DEBUG] Main div has {len(children)} direct children")
                for i, child in enumerate(children[:5]):
                    cls = child.get_attribute('class') or 'no-class'
                    print(f"[DEBUG]   Child {i}: class='{cls[:50]}...'")
            except Exception as e:
                print(f"[DEBUG] Could not analyze page structure: {e}")
            return messages

        processed_texts = set()

        for idx, msg_container in enumerate(all_messages):
            try:
                # Debug: Show what each container contains
                container_class = msg_container.get_attribute('class') or 'no-class'
                container_html_snippet = msg_container.get_attribute('innerHTML')[:200] if msg_container.get_attribute('innerHTML') else 'empty'
                print(f"\n[DEBUG] Container {idx}: class='{container_class[:80]}'")
                
                # Check if it has images (might be image-only message)
                has_images = len(msg_container.find_elements(By.XPATH, './/img')) > 0
                has_document = len(msg_container.find_elements(By.XPATH, './/span[contains(text(), ".pdf") or contains(text(), ".jpg") or contains(text(), ".png")]')) > 0
                
                if has_images:
                    print(f"[DEBUG]   → Contains images (likely image message, skipping text extraction)")
                if has_document:
                    print(f"[DEBUG]   → Contains document reference")
                
                # Look for text content in this message
                # First, try to find the copyable-text div which contains actual text messages
                copyable_divs = msg_container.find_elements(By.XPATH, 
                    './/div[contains(@class, "copyable-text")][@data-pre-plain-text]'
                )
                print(f"[DEBUG]   → Found {len(copyable_divs)} copyable-text divs with data-pre-plain-text")
                
                if not copyable_divs:
                    # Try alternative: look for any div with data-pre-plain-text
                    copyable_divs = msg_container.find_elements(By.XPATH, 
                        './/div[@data-pre-plain-text]'
                    )
                    print(f"[DEBUG]   → Found {len(copyable_divs)} divs with data-pre-plain-text (fallback)")
                
                for copyable in copyable_divs:
                    try:
                        # Get sender and timestamp from data-pre-plain-text
                        pre_text = copyable.get_attribute("data-pre-plain-text") or ""
                        
                        timestamp = ""
                        sender_name = "Unknown"
                        
                        if pre_text and "]" in pre_text:
                            # Format is like "[12:00 PM, 12/16/2024] Sender Name: "
                            timestamp = pre_text.split("]")[0].replace("[", "").strip()
                            sender_part = pre_text.split("]")[1] if len(pre_text.split("]")) > 1 else ""
                            sender_name = sender_part.strip().rstrip(":").strip()
                            if not sender_name:
                                sender_name = "You"  # Your own messages might not have sender
                        
                        # Get the actual message text from spans
                        text_elements = copyable.find_elements(By.XPATH, 
                            './/span[contains(@class, "selectable-text")]//span | '
                            './/span[@dir="ltr"] | '
                            './/span[@dir="auto"]'
                        )
                        
                        message_text = ""
                        for elem in text_elements:
                            try:
                                if elem.text and elem.text.strip():
                                    message_text = elem.text.strip()
                                    break
                            except:
                                continue
                        
                        # Skip if no text or if it looks like a file name
                        if not message_text:
                            continue
                        
                        # Skip file attachment notifications
                        if any(ext in message_text.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.mp4', '.webp']):
                            if len(message_text) < 50:  # File names are usually short
                                continue
                        
                        # Create unique key
                        text_key = f"{sender_name}:{message_text}"
                        if text_key in processed_texts:
                            continue
                        processed_texts.add(text_key)
                        
                        messages.append({
                            "sender": sender_name,
                            "timestamp": timestamp,
                            "text": message_text,
                        })
                        print(f"  Found message: [{sender_name}]: {message_text[:60]}...")
                        
                    except Exception as e:
                        continue
                
                # Also check for outgoing messages (your own messages)
                # These might have different structure
                if not copyable_divs:
                    # Check if this is an outgoing message
                    element_class = msg_container.get_attribute("class") or ""
                    is_outgoing = "message-out" in element_class
                    
                    # Try to get text from any selectable-text span
                    text_spans = msg_container.find_elements(By.XPATH,
                        './/span[contains(@class, "selectable-text")]//span'
                    )
                    
                    message_text = ""
                    for span in text_spans:
                        try:
                            if span.text and span.text.strip():
                                text = span.text.strip()
                                # Skip if it looks like a file name
                                if not any(ext in text.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc']):
                                    message_text = text
                                    break
                        except:
                            continue
                    
                    if message_text:
                        sender_name = "You" if is_outgoing else "Unknown"
                        text_key = f"{sender_name}:{message_text}"
                        if text_key not in processed_texts:
                            processed_texts.add(text_key)
                            messages.append({
                                "sender": sender_name,
                                "timestamp": "",
                                "text": message_text,
                            })
                            print(f"  Found message: [{sender_name}]: {message_text[:60]}...")
                
            except Exception as e:
                print(f"Error processing message {idx}: {e}")
                continue

        print(f"\n==============================")
        print(f"Extracted {len(messages)} text messages")
        print(f"==============================")
        
        if messages:
            print("\nAll extracted messages:")
            for msg in messages:
                print(f"  [{msg['timestamp']}] {msg['sender']}: {msg['text']}")

        return messages

    def download_pdfs(self):
        """Find and download all PDF files in the currently opened chat.
        Returns list of downloaded PDF file paths in download_dir.
        """
        pdf_paths = []
        try:
            # Clear old PDFs so each scrape only tracks fresh downloads
            for old_pdf in glob.glob(os.path.join(self.download_dir, "*.pdf")):
                try:
                    os.remove(old_pdf)
                except Exception:
                    pass
            print("\n==============================")
            print("Searching for PDF files in chat...")
            print("==============================")
            
            # Scroll through messages to load all documents
            try:
                try:
                    message_container = self.driver.find_element(
                        By.XPATH, '//div[@class="_ajyl"]'
                    )
                except NoSuchElementException:
                    message_container = self.driver.find_element(
                        By.XPATH,
                        '//div[contains(@class, "copyable-area")]//div[@role="application"]',
                    )
                
                scroll_pause_time = 2
                last_height = 0
                no_change_count = 0
                max_no_change = 3
                
                while no_change_count < max_no_change:
                    current_height = self.driver.execute_script(
                        "return arguments[0].scrollTop", message_container
                    )
                    self.driver.execute_script(
                        "arguments[0].scrollTop = 0", message_container
                    )
                    time.sleep(scroll_pause_time)
                    new_height = self.driver.execute_script(
                        "return arguments[0].scrollTop", message_container
                    )
                    if abs(new_height - last_height) < 10:
                        no_change_count += 1
                    else:
                        no_change_count = 0
                    last_height = new_height
                    self.driver.execute_script(
                        "arguments[0].scrollTop = 100", message_container
                    )
                    time.sleep(0.5)
                
                self.driver.execute_script(
                    "arguments[0].scrollTop = arguments[0].scrollHeight",
                    message_container,
                )
                time.sleep(2)
            except Exception:
                pass
            
            # Comprehensive selectors for all PDF document types
            file_selectors = [
                # Standard document cards
                '//div[@data-testid="media-document"]',
                '//div[@data-testid="document-msg"]',
                
                # PDF icon containers
                '//div[contains(@class, "document")]//span[contains(text(), ".pdf")]',
                
                # Message containers with PDF text
                '//div[@data-testid="msg-container"]//span[contains(text(), ".pdf")]',
                
                # Direct PDF links
                '//a[contains(@href, ".pdf")]',
                
                # Document preview cards (new WhatsApp UI)
                '//div[@role="button"]//span[contains(text(), ".pdf")]',
                
                # Large document cards with preview
                '//div[contains(@class, "_akbu")]//span[contains(text(), ".pdf")]',
                
                # Alternative document containers
                '//div[contains(@class, "message-in")]//span[contains(text(), ".pdf")]',
                '//div[contains(@class, "message-out")]//span[contains(text(), ".pdf")]',
            ]
            
            pdf_elements = []
            for selector in file_selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    if elements:
                        pdf_elements.extend(elements)
                        print(f"Found {len(elements)} potential PDF elements with selector: {selector}")
                except Exception:
                    continue
            
            # Remove duplicates while preserving order
            seen = set()
            unique_pdf_elements = []
            for elem in pdf_elements:
                try:
                    # Use the text content as identifier to avoid duplicates
                    elem_text = elem.text
                    if elem_text and ".pdf" in elem_text.lower():
                        if elem_text not in seen:
                            seen.add(elem_text)
                            unique_pdf_elements.append(elem)
                except Exception:
                    continue
            
            print(f"Total unique PDF documents found: {len(unique_pdf_elements)}")
            
            pdf_count = 0
            for pdf_elem in unique_pdf_elements:
                try:
                    # Extract PDF name first
                    pdf_name = "unknown.pdf"
                    try:
                        # Try multiple methods to get the filename
                        name_selectors = [
                            './/span[contains(text(), ".pdf")]',
                            './/span[contains(@class, "selectable-text")]',
                            './/div[contains(@class, "copyable-text")]//span',
                        ]
                        
                        for name_sel in name_selectors:
                            try:
                                name_elem = pdf_elem.find_element(By.XPATH, name_sel)
                                text = name_elem.text.strip()
                                if text and ".pdf" in text.lower():
                                    pdf_name = text
                                    break
                            except Exception:
                                continue
                    except Exception:
                        pass
                    
                    print(f"\nAttempting to download: {pdf_name}")
                    
                    # Scroll element into view
                    self.driver.execute_script(
                        "arguments[0].scrollIntoView({block: 'center'});", pdf_elem
                    )
                    time.sleep(1)
                    
                    # Find the parent message container
                    try:
                        msg_container = pdf_elem.find_element(
                            By.XPATH, './ancestor::div[@data-testid="msg-container"]'
                        )
                    except Exception:
                        msg_container = pdf_elem
                    
                    # Strategy 1: Look for download button/icon
                    download_clicked = False
                    download_selectors = [
                        './/span[@data-icon="document-download"]',
                        './/span[@data-icon="download"]',
                        './/button[@aria-label="Download"]',
                        './/*[@data-testid="media-card-download"]',
                        './/div[@role="button" and contains(@aria-label, "Download")]',
                        './/span[@data-icon="media-download"]',
                    ]
                    
                    for dl_sel in download_selectors:
                        try:
                            download_btn = msg_container.find_element(By.XPATH, dl_sel)
                            if download_btn.is_displayed():
                                print(f"  → Clicking download button")
                                download_btn.click()
                                download_clicked = True
                                time.sleep(2)
                                break
                        except Exception:
                            continue
                    
                    # Strategy 2: Click the document card itself to open preview
                    if not download_clicked:
                        try:
                            # Find clickable document card
                            card_selectors = [
                                './/div[@role="button"]',
                                './/div[contains(@class, "_akbu")]',
                                './/div[@data-testid="media-document"]',
                            ]
                            
                            clickable_card = None
                            for card_sel in card_selectors:
                                try:
                                    clickable_card = msg_container.find_element(By.XPATH, card_sel)
                                    if clickable_card:
                                        break
                                except Exception:
                                    continue
                            
                            if not clickable_card:
                                clickable_card = msg_container
                            
                            print(f"  → Clicking document card to open preview")
                            clickable_card.click()
                            time.sleep(2)
                            
                            # Handle preview dialog
                            try:
                                # Wait for preview dialog
                                WebDriverWait(self.driver, 5).until(
                                    EC.presence_of_element_located(
                                        (By.XPATH, '//div[contains(@class, "drawer-container")] | //div[@role="dialog"]')
                                    )
                                )
                                
                                # Look for download button in preview
                                preview_download_selectors = [
                                    '//span[@data-icon="download"]',
                                    '//button[@aria-label="Download"]',
                                    '//div[@role="button"]//span[@data-icon="download"]',
                                    '//span[@data-icon="media-download"]',
                                ]
                                
                                for preview_sel in preview_download_selectors:
                                    try:
                                        preview_btn = self.driver.find_element(By.XPATH, preview_sel)
                                        if preview_btn.is_displayed():
                                            print(f"  → Clicking download in preview dialog")
                                            preview_btn.click()
                                            download_clicked = True
                                            time.sleep(2)
                                            break
                                    except Exception:
                                        continue
                                
                                # Close preview dialog
                                try:
                                    close_selectors = [
                                        '//button[@aria-label="Close"]',
                                        '//span[@data-icon="x-viewer"]',
                                        '//span[@data-icon="back"]',
                                    ]
                                    for close_sel in close_selectors:
                                        try:
                                            close_btn = self.driver.find_element(By.XPATH, close_sel)
                                            if close_btn.is_displayed():
                                                close_btn.click()
                                                time.sleep(1)
                                                break
                                        except Exception:
                                            continue
                                except Exception:
                                    # Press ESC to close
                                    self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                                    time.sleep(1)
                                    
                            except TimeoutException:
                                print(f"  → No preview dialog appeared")
                                pass
                            
                        except Exception as e:
                            print(f"  → Error with preview strategy: {e}")
                    
                    # Wait for download to complete
                    if download_clicked:
                        print(f"  → Waiting for download to complete...")
                        max_wait = 15
                        initial_files = set(glob.glob(os.path.join(self.download_dir, "*.pdf")))
                        
                        for i in range(max_wait):
                            time.sleep(1)
                            current_files = set(glob.glob(os.path.join(self.download_dir, "*.pdf")))
                            new_files = current_files - initial_files
                            
                            if new_files:
                                print(f"  ✓ Download completed: {len(new_files)} file(s)")
                                pdf_paths.extend(list(new_files))
                                pdf_count += 1
                                break
                            
                            # Check for .crdownload files (Chrome partial downloads)
                            partial_files = glob.glob(os.path.join(self.download_dir, "*.crdownload"))
                            if partial_files:
                                print(f"  → Download in progress... ({i+1}s)")
                        else:
                            print(f"  ✗ Download timeout - file may not have downloaded")
                    
                except Exception as e:
                    print(f"  ✗ Error downloading PDF: {e}")
                    continue
            
            # Final check for all PDFs in download directory
            time.sleep(2)
            final_pdf_files = glob.glob(os.path.join(self.download_dir, "*.pdf"))

            # Deduplicate files like "PL02.pdf" and "PL02 (1).pdf" so they count as one
            unique_by_base = {}
            for path in final_pdf_files:
                base = os.path.basename(path)
                # Normalize names like "PL02 (1).pdf" → "PL02.pdf"
                canonical = re.sub(r" \(\d+\)(?=\.pdf$)", "", base, flags=re.IGNORECASE)
                if canonical not in unique_by_base:
                    unique_by_base[canonical] = path

            deduped_pdf_files = list(unique_by_base.values())

            print("\n==============================")
            print(f"Total PDFs downloaded: {len(deduped_pdf_files)}")
            print("==============================")
            
            return deduped_pdf_files
            
        except Exception as e:
            print(f"Error while downloading PDFs: {e}")
            import traceback
            traceback.print_exc()
            return []

    def safe_click(self, element):
        """Try multiple methods to click an element"""
        try:
            element.click()
            return True
        except:
            try:
                self.driver.execute_script("arguments[0].click();", element)
                return True
            except:
                try:
                    ActionChains(self.driver).move_to_element(element).click().perform()
                    return True
                except:
                    return False

    def download_image_high_res(self, img_element, save_path):
        """
        Download image at full resolution using multiple methods
        Returns True if successful, False otherwise
        """
        try:
            # Method 1: Try to get the highest resolution src from the element
            img_src = img_element.get_attribute("src")
            
            if img_src:
                # For data URLs (base64 encoded images)
                if img_src.startswith("data:image"):
                    try:
                        header, encoded = img_src.split(",", 1)
                        image_data = base64.b64decode(encoded)
                        
                        with open(save_path, 'wb') as f:
                            f.write(image_data)
                        print(f"✓ Saved from base64 data URL")
                        return True
                    except Exception as e:
                        print(f"Failed to decode base64: {e}")
                
                # For blob URLs, we need to use JavaScript to fetch the actual data
                elif "blob:" in img_src:
                    try:
                        js_code = """
                        async function fetchBlob(url) {
                            const response = await fetch(url);
                            const blob = await response.blob();
                            return new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.readAsDataURL(blob);
                            });
                        }
                        return await fetchBlob(arguments[0]);
                        """
                        
                        base64_data = self.driver.execute_async_script(js_code, img_src)
                        
                        if base64_data:
                            header, encoded = base64_data.split(",", 1)
                            image_data = base64.b64decode(encoded)
                            
                            with open(save_path, 'wb') as f:
                                f.write(image_data)
                            print(f"✓ Saved from blob URL (high res)")
                            return True
                    except Exception as e:
                        print(f"Blob URL method failed: {e}")
                
                # For HTTP/HTTPS URLs
                elif img_src.startswith("http"):
                    try:
                        headers = {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                        response = requests.get(img_src, headers=headers, timeout=15)
                        
                        if response.status_code == 200:
                            with open(save_path, 'wb') as f:
                                f.write(response.content)
                            print(f"✓ Downloaded from URL (high res)")
                            return True
                    except Exception as e:
                        print(f"HTTP download failed: {e}")
            
            # Method 2: Try to get higher resolution source from srcset attribute
            try:
                srcset = img_element.get_attribute("srcset")
                if srcset:
                    sources = srcset.split(",")
                    highest_res = max(sources, key=lambda x: int(x.split()[-1].rstrip('wx')) if len(x.split()) > 1 else 0)
                    high_res_url = highest_res.split()[0]
                    
                    if high_res_url.startswith("http"):
                        headers = {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                        response = requests.get(high_res_url, headers=headers, timeout=15)
                        
                        if response.status_code == 200:
                            with open(save_path, 'wb') as f:
                                f.write(response.content)
                            print(f"✓ Downloaded from srcset (highest res)")
                            return True
            except Exception as e:
                print(f"Srcset method failed: {e}")
            
            # Method 3: Use Canvas to render at higher resolution
            try:
                js_code = """
                const img = arguments[0];
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                return canvas.toDataURL('image/png');
                """
                
                base64_data = self.driver.execute_script(js_code, img_element)
                
                if base64_data:
                    header, encoded = base64_data.split(",", 1)
                    image_data = base64.b64decode(encoded)
                    
                    with open(save_path, 'wb') as f:
                        f.write(image_data)
                    print(f"✓ Rendered via Canvas at natural resolution")
                    return True
            except Exception as e:
                print(f"Canvas method failed: {e}")
            
            # Method 4: Fallback to high-quality screenshot
            print("⚠ Using screenshot fallback (may have lower resolution)")
            img_element.screenshot(save_path)
            return True
            
        except Exception as e:
            print(f"All download methods failed: {e}")
            return False

    def download_images_and_ocr(self):
        """
        Download images from WhatsApp group and perform OCR.
        Returns list of dictionaries with image paths and extracted text.
        """
        if not TESSERACT_AVAILABLE:
            print("Warning: Tesseract OCR not available. Images will be downloaded but OCR will be skipped.")
        
        extracted_texts = []
        
        try:
            print("\n==============================")
            print("Searching for images in chat...")
            print("==============================")
            
            # Scroll to load messages
            try:
                try:
                    chat_panel = self.driver.find_element(By.XPATH, '//div[@data-tab="6"]')
                except:
                    chat_panel = self.driver.find_element(By.XPATH, '//div[@id="main"]')
                
                for i in range(5):
                    self.driver.execute_script("arguments[0].scrollTop = arguments[0].scrollTop - 1000", chat_panel)
                    time.sleep(1)
                    print(f"Scrolled {i+1}/5...")
                
                time.sleep(2)
            except Exception:
                pass
            
            print("Finding images and documents...")
            
            message_items = []
            processed_sources = set()
            processed_filenames = set()
            
            # Get all message containers
            all_messages = self.driver.find_elements(By.XPATH, 
                '//div[contains(@class, "message-in") or contains(@class, "message-out")] | '
                '//div[@data-id]'
            )
            
            print(f"Scanning {len(all_messages)} messages...")
            
            for msg_container in all_messages:
                try:
                    # Check if this message has a document attachment with filename
                    filename_elements = msg_container.find_elements(By.XPATH, 
                        './/span[contains(text(), ".jpg") or contains(text(), ".jpeg") or '
                        'contains(text(), ".png") or contains(text(), ".JPG") or '
                        'contains(text(), ".PNG") or contains(text(), ".JPEG") or '
                        'contains(text(), ".gif") or contains(text(), ".webp")]'
                    )
                    
                    # Track if this message has a document
                    has_document = False
                    preview_img = None  # Track preview image for document to avoid double-processing
                    
                    if filename_elements:
                        # This is a DOCUMENT attachment
                        filename = filename_elements[0].text.strip()
                        
                        if filename not in processed_filenames:
                            # Check if it's an image file
                            if any(ext in filename.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
                                processed_filenames.add(filename)
                                has_document = True
                                
                                # Try to find the download button or clickable area
                                download_btn = None
                                try:
                                    # Look for download icon/button with more selectors
                                    download_btn = msg_container.find_element(By.XPATH, 
                                        './/span[@data-icon="download"] | '
                                        './/span[@data-icon="media-download"] | '
                                        './/div[@role="button"][contains(@class, "download")] | '
                                        './/button[contains(@aria-label, "download") or contains(@aria-label, "Download")]'
                                    )
                                except:
                                    pass
                                
                                # Get any preview image in this message
                                try:
                                    # Look for preview images, excluding small icons
                                    all_imgs = msg_container.find_elements(By.XPATH, './/img')
                                    for img in all_imgs:
                                        try:
                                            # Skip small images (likely icons)
                                            if img.size['width'] >= 50 and img.size['height'] >= 50:
                                                preview_img = img
                                                break
                                        except:
                                            continue
                                except:
                                    pass
                                
                                message_items.append({
                                    'type': 'document',
                                    'filename': filename,
                                    'container': msg_container,
                                    'download_btn': download_btn,
                                    'preview_img': preview_img
                                })
                                
                                print(f"Found document: {filename}")
                    
                    # ALWAYS check for regular images, even if document was found
                    # (A message can have both text/images AND a document attachment)
                    images = msg_container.find_elements(By.XPATH, './/img')
                    
                    for img in images:
                        try:
                            src = img.get_attribute("src")
                            
                            # Skip if no src or already processed
                            if not src or src in processed_sources:
                                continue
                            
                            # Skip small images (icons, avatars)
                            try:
                                if img.size['width'] < 50 or img.size['height'] < 50:
                                    continue
                            except:
                                continue
                            
                            # Skip profile pictures and avatars
                            try:
                                parent = img.find_element(By.XPATH, './..')
                                parent_class = str(parent.get_attribute("class") or "")
                                if "avatar" in parent_class.lower() or "default-user" in parent_class.lower():
                                    continue
                            except:
                                pass
                            
                            # Skip if this is the preview image of a document we already processed
                            # (to avoid double-processing) - compare by src attribute
                            if has_document:
                                try:
                                    if preview_img and img.get_attribute("src") == preview_img.get_attribute("src"):
                                        continue
                                except:
                                    pass
                            
                            processed_sources.add(src)
                            message_items.append({
                                'type': 'image',
                                'src': src,
                                'element': img,
                                'container': msg_container
                            })
                            print(f"Found regular image (src: {src[:50]}...)")
                            
                        except Exception as e:
                            continue
                            
                except Exception as e:
                    continue
            
            print(f"\n{'='*60}")
            print(f"Found {len(message_items)} total items:")
            print(f"  - Documents: {sum(1 for x in message_items if x['type']=='document')}")
            print(f"  - Regular Images: {sum(1 for x in message_items if x['type']=='image')}")
            print(f"{'='*60}\n")
            
            if len(message_items) == 0:
                print("\nNo images or documents found.")
                return []
            
            for idx, item in enumerate(message_items):
                try:
                    print(f"\nProcessing {item['type']} {idx + 1}/{len(message_items)}...")
                    
                    image_path = None
                    
                    if item['type'] == 'document':
                        # === HANDLE DOCUMENT DOWNLOADS ===
                        filename = item['filename']
                        print(f"  Document: {filename}")
                        
                        # Scroll to the container
                        try:
                            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", item['container'])
                            time.sleep(1.5)
                        except:
                            pass
                        
                        # Method 1: Try clicking the document container itself to open it
                        if not image_path:
                            try:
                                print("  Attempting to open document...")
                                # Click on the document container
                                self.safe_click(item['container'])
                                time.sleep(2)
                                
                                # Look for download button in opened view or try to find "Save as..." button
                                try:
                                    # Try multiple selectors for download/save buttons
                                    save_buttons = self.driver.find_elements(By.XPATH, 
                                        '//span[contains(text(), "Save as") or contains(text(), "Save")] | '
                                        '//button[contains(text(), "Save")] | '
                                        '//div[@role="button"][contains(., "Save")] | '
                                        '//span[@data-icon="download"] | '
                                        '//span[@data-icon="media-download"]'
                                    )
                                    
                                    if save_buttons:
                                        for btn in save_buttons:
                                            try:
                                                if btn.is_displayed() and btn.is_enabled():
                                                    self.safe_click(btn)
                                                    time.sleep(3)
                                                    break
                                            except:
                                                continue
                                except:
                                    pass
                                
                                # Check if file was downloaded (check both directories)
                                downloaded_file = None
                                for check_dir in [self.download_dir, self.images_dir]:
                                    potential_file = os.path.join(check_dir, filename)
                                    if os.path.exists(potential_file):
                                        downloaded_file = potential_file
                                        break
                                
                                if downloaded_file:
                                    image_path = os.path.join(self.images_dir, f"doc_{idx + 1}_{filename}")
                                    if downloaded_file != image_path:
                                        shutil.move(downloaded_file, image_path)
                                    else:
                                        os.rename(downloaded_file, image_path)
                                    print(f"  ✓ Downloaded: {os.path.basename(image_path)}")
                                else:
                                    # Try to find any recently downloaded file in both directories
                                    base_name = os.path.splitext(filename)[0]
                                    for check_dir in [self.download_dir, self.images_dir]:
                                        for file in os.listdir(check_dir):
                                            if base_name.lower() in file.lower() and not file.startswith('doc_'):
                                                old_path = os.path.join(check_dir, file)
                                                image_path = os.path.join(self.images_dir, f"doc_{idx + 1}_{filename}")
                                                if os.path.exists(old_path):
                                                    shutil.move(old_path, image_path)
                                                    print(f"  ✓ Downloaded: {os.path.basename(image_path)}")
                                                    break
                                        if image_path and os.path.exists(image_path):
                                            break
                                
                                # Close any opened dialogs
                                try:
                                    self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                                    time.sleep(0.5)
                                except:
                                    pass
                                    
                            except Exception as e:
                                print(f"  ✗ Open document failed: {e}")
                        
                        # Method 2: Try to click download button if available (from original detection)
                        if not image_path and item['download_btn']:
                            try:
                                print("  Attempting download via button...")
                                self.safe_click(item['download_btn'])
                                time.sleep(4)
                                
                                # Find the downloaded file (check both directories)
                                downloaded_file = None
                                for check_dir in [self.download_dir, self.images_dir]:
                                    potential_file = os.path.join(check_dir, filename)
                                    if os.path.exists(potential_file):
                                        downloaded_file = potential_file
                                        break
                                
                                if downloaded_file:
                                    image_path = os.path.join(self.images_dir, f"doc_{idx + 1}_{filename}")
                                    if downloaded_file != image_path:
                                        shutil.move(downloaded_file, image_path)
                                    else:
                                        os.rename(downloaded_file, image_path)
                                    print(f"  ✓ Downloaded: {os.path.basename(image_path)}")
                                else:
                                    # Try to find any recently downloaded file in both directories
                                    base_name = os.path.splitext(filename)[0]
                                    for check_dir in [self.download_dir, self.images_dir]:
                                        for file in os.listdir(check_dir):
                                            if base_name.lower() in file.lower() and not file.startswith('doc_'):
                                                old_path = os.path.join(check_dir, file)
                                                image_path = os.path.join(self.images_dir, f"doc_{idx + 1}_{filename}")
                                                if os.path.exists(old_path):
                                                    shutil.move(old_path, image_path)
                                                    print(f"  ✓ Downloaded: {os.path.basename(image_path)}")
                                                    break
                                        if image_path and os.path.exists(image_path):
                                            break
                            except Exception as e:
                                print(f"  ✗ Download button failed: {e}")
                        
                        # Method 3: Try clicking preview image to open in viewer
                        if not image_path and item['preview_img']:
                            try:
                                print("  Attempting to open preview in viewer...")
                                self.safe_click(item['preview_img'])
                                time.sleep(2.5)
                                
                                # Look for full-size image in viewer
                                try:
                                    all_dialog_imgs = self.driver.find_elements(By.XPATH, 
                                        '//div[@role="dialog"]//img | '
                                        '//img[contains(@style, "cursor")] | '
                                        '//div[contains(@class, "media-viewer")]//img'
                                    )
                                    
                                    if all_dialog_imgs:
                                        # Get the largest image
                                        largest = max(all_dialog_imgs, key=lambda x: x.size['width'] * x.size['height'])
                                        
                                        image_path = os.path.join(self.images_dir, f"doc_{idx + 1}_{filename}")
                                        largest.screenshot(image_path)
                                        print(f"  ✓ Captured from viewer: {os.path.basename(image_path)}")
                                        
                                        # Close viewer
                                        self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                                        time.sleep(0.5)
                                    else:
                                        raise Exception("No full image in viewer")
                                except Exception as e:
                                    # Close viewer if open
                                    try:
                                        self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                                        time.sleep(0.5)
                                    except:
                                        pass
                                    raise e
                            except Exception as e:
                                print(f"  ✗ Preview viewer failed: {e}")
                        
                        # Method 4: Try to capture preview/thumbnail directly
                        if not image_path and item['preview_img']:
                            try:
                                print("  Capturing preview thumbnail...")
                                image_path = os.path.join(self.images_dir, f"doc_{idx + 1}_preview_{filename}")
                                item['preview_img'].screenshot(image_path)
                                print(f"  ✓ Captured preview: {os.path.basename(image_path)}")
                            except Exception as e:
                                print(f"  ✗ Preview capture failed: {e}")
                        
                        # Method 5: Try to find and click any button in the document container
                        if not image_path:
                            try:
                                print("  Trying alternative button detection...")
                                # Look for any clickable buttons in the container
                                buttons = item['container'].find_elements(By.XPATH, 
                                    './/button | .//div[@role="button"] | .//span[@role="button"]'
                                )
                                
                                for btn in buttons:
                                    try:
                                        btn_text = btn.text.lower()
                                        if 'save' in btn_text or 'download' in btn_text or btn.get_attribute('data-icon'):
                                            if btn.is_displayed():
                                                self.safe_click(btn)
                                                time.sleep(3)
                                                
                                                # Check for downloaded file in both directories
                                                base_name = os.path.splitext(filename)[0]
                                                for check_dir in [self.download_dir, self.images_dir]:
                                                    for file in os.listdir(check_dir):
                                                        if base_name.lower() in file.lower() and not file.startswith('doc_'):
                                                            old_path = os.path.join(check_dir, file)
                                                            image_path = os.path.join(self.images_dir, f"doc_{idx + 1}_{filename}")
                                                            if os.path.exists(old_path):
                                                                shutil.move(old_path, image_path)
                                                                print(f"  ✓ Downloaded via button: {os.path.basename(image_path)}")
                                                                break
                                                    if image_path and os.path.exists(image_path):
                                                        break
                                                
                                                if image_path:
                                                    break
                                    except:
                                        continue
                            except Exception as e:
                                print(f"  ✗ Alternative button method failed: {e}")
                                
                    else:
                        # === HANDLE REGULAR IMAGES ===
                        print(f"  Regular image from src: {item['src'][:50]}...")
                        
                        try:
                            # Scroll to element
                            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", item['element'])
                            time.sleep(1)
                            
                            # Try Method 1: Click to open in full viewer
                            print("  Opening in viewer...")
                            if self.safe_click(item['element']):
                                time.sleep(2.5)
                                
                                # Find the full-size image in the viewer
                                try:
                                    # Look for the large preview in dialog
                                    all_dialog_imgs = self.driver.find_elements(By.XPATH, 
                                        '//div[@role="dialog"]//img | '
                                        '//img[contains(@style, "cursor")]'
                                    )
                                    
                                    if all_dialog_imgs:
                                        # Get the largest image
                                        largest = max(all_dialog_imgs, key=lambda x: x.size['width'] * x.size['height'])
                                        
                                        image_path = os.path.join(self.images_dir, f"image_{idx + 1}.png")
                                        
                                        if self.download_image_high_res(largest, image_path):
                                            print(f"  ✓ Saved full-size: {os.path.basename(image_path)}")
                                        else:
                                            print("  ⚠ Failed to save full-size image")
                                        
                                        # Close viewer
                                        self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                                        time.sleep(0.5)
                                    else:
                                        # No dialog found, close and use thumbnail
                                        self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                                        raise Exception("No full image found")
                                        
                                except Exception as e:
                                    # Close viewer if open
                                    try:
                                        self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                                        time.sleep(0.5)
                                    except:
                                        pass
                                    raise e
                            else:
                                raise Exception("Could not click image")
                                
                        except Exception as e:
                            # Method 2: Use helper to download/extract from thumbnail element
                            print(f"  Viewer method failed, using thumbnail...")
                            try:
                                image_path = os.path.join(self.images_dir, f"image_{idx + 1}_thumb.png")
                                # Use the high res helper on the thumbnail element directly
                                # It will try to extract high res src, srcset, canvas, or fallback to screenshot
                                if self.download_image_high_res(item['element'], image_path):
                                    print(f"  ✓ Saved thumbnail: {os.path.basename(image_path)}")
                                else:
                                    print(f"  ✗ Thumbnail processing failed")
                                    image_path = None
                            except Exception as e2:
                                print(f"  ✗ Error processing thumbnail: {e2}")
                                image_path = None
                    
                    # Extract text using OCR if image was saved
                    if image_path and os.path.exists(image_path):
                        try:
                            print("  Running OCR...")
                            if TESSERACT_AVAILABLE:
                                img = Image.open(image_path)
                                text = pytesseract.image_to_string(img, lang='eng')
                                
                                if text.strip():
                                    preview = text.strip()[:150].replace('\n', ' ')
                                    print(f"  ✓ Text extracted ({len(text)} characters)")
                                    print(f"    Preview: {preview}...")
                                    extracted_texts.append({
                                        'image': image_path,
                                        'text': text,
                                        'type': item['type']
                                    })
                                else:
                                    print(f"  ✗ No text found in image")
                            else:
                                print(f"  ⚠ OCR skipped (Tesseract not available)")
                        except Exception as e:
                            print(f"  ✗ OCR Error: {e}")
                    else:
                        print(f"  ⚠ Could not save/process this item")
                    
                except Exception as e:
                    print(f"  ✗ Error: {e}")
                    try:
                        self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                    except:
                        pass
                    continue
            
            print(f"\n{'='*60}")
            print(f"EXTRACTION COMPLETE!")
            print(f"{'='*60}")
            print(f"Total items processed: {len(message_items)}")
            print(f"  - Documents: {sum(1 for x in message_items if x['type']=='document')}")
            print(f"  - Regular Images: {sum(1 for x in message_items if x['type']=='image')}")
            print(f"Items with extracted text: {len(extracted_texts)}")
            print(f"  - From Documents: {sum(1 for x in extracted_texts if x['type']=='document')}")
            print(f"  - From Images: {sum(1 for x in extracted_texts if x['type']=='image')}")
            print(f"{'='*60}")
            
            return extracted_texts
            
        except Exception as e:
            print(f"Error while downloading images and performing OCR: {e}")
            import traceback
            traceback.print_exc()
            return []

    def close(self):
        """Close the WhatsApp Web browser session."""
        if self.driver:
            self.driver.quit()
            self.connected = False


def is_tesseract_available():
    """Check if Tesseract OCR is available"""
    return TESSERACT_AVAILABLE
