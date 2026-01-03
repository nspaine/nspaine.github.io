"""
Architecture Image Sorter - Grid View
A simple drag-and-drop grid to reorder architecture gallery images.
Uses thumbnails for fast loading, renames full-res files with number prefixes.
"""

import os
import shutil
import signal
from pathlib import Path
import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk

class ImageSorter:
    def __init__(self, root):
        self.root = root
        self.root.title("Architecture Image Sorter - Drag to Reorder")
        self.root.geometry("1600x800")  # Increased width for 7 columns
        
        # Make window appear in front
        self.root.lift()
        self.root.attributes('-topmost', True)
        self.root.after(100, lambda: self.root.attributes('-topmost', False))
        
        # Paths
        self.image_dir = Path(__file__).parent / "public" / "images" / "architecture"
        self.thumb_dir = Path(__file__).parent / "public" / "images" / "architecture" / "thumbs"
        
        # Get all image files from main directory
        self.image_files = sorted([
            f for f in self.image_dir.glob("*")
            if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp'] and f.is_file()
        ])
        
        if not self.image_files:
            messagebox.showerror("Error", f"No images found in {self.image_dir}")
            root.destroy()
            return
        
        # Drag state
        self.drag_start_index = None
        self.drag_widget = None
        self.images_loaded = False
        self.drop_indicator_height = 220  # Default height
        
        self.setup_ui()
        self.load_images()
    
    def setup_ui(self):
        # Title bar
        title_bar = tk.Frame(self.root, bg="#2c3e50", height=50)
        title_bar.pack(fill=tk.X, side=tk.TOP)
        
        title_label = tk.Label(
            title_bar,
            text="Architecture Image Sorter",
            font=("Arial", 14, "bold"),
            bg="#2c3e50",
            fg="white",
            pady=10
        )
        title_label.pack(side=tk.LEFT, padx=20)
        
        # Zoom controls
        zoom_frame = tk.Frame(title_bar, bg="#2c3e50")
        zoom_frame.pack(side=tk.LEFT, padx=20)
        
        zoom_label = tk.Label(
            zoom_frame,
            text="Zoom:",
            font=("Arial", 10),
            bg="#2c3e50",
            fg="white"
        )
        zoom_label.pack(side=tk.LEFT, padx=(0, 10))
        
        # Zoom level (50-300%)
        self.zoom_level = 100
        
        # Zoom slider
        self.zoom_slider = tk.Scale(
            zoom_frame,
            from_=50,
            to=300,
            orient=tk.HORIZONTAL,
            command=self.on_zoom_change,
            bg="#34495e",
            fg="white",
            highlightthickness=0,
            troughcolor="#2c3e50",
            activebackground="#3498db",
            length=200,
            width=15,
            showvalue=0  # Hide default value display
        )
        self.zoom_slider.set(100)
        self.zoom_slider.pack(side=tk.LEFT, padx=5)
        
        self.zoom_display = tk.Label(
            zoom_frame,
            text="100%",
            font=("Arial", 10),
            bg="#2c3e50",
            fg="white",
            width=5
        )
        self.zoom_display.pack(side=tk.LEFT, padx=(5, 0))
        
        # Button frame in title
        button_frame = tk.Frame(title_bar, bg="#2c3e50") # Changed from title_frame to title_bar
        button_frame.pack(side=tk.RIGHT, padx=20)
        
        apply_btn = tk.Button(
            button_frame,
            text="✓ Apply Changes",
            command=self.apply_changes,
            bg="#4CAF50",
            fg="white",
            font=("Arial", 11, "bold"),
            padx=15,
            pady=8,
            relief=tk.FLAT,
            cursor="hand2"
        )
        apply_btn.pack(side=tk.LEFT, padx=5)
        
        cancel_btn = tk.Button(
            button_frame,
            text="✕ Cancel",
            command=self.root.destroy,
            bg="#f44336",
            fg="white",
            font=("Arial", 11, "bold"),
            padx=15,
            pady=8,
            relief=tk.FLAT,
            cursor="hand2"
        )
        cancel_btn.pack(side=tk.LEFT, padx=5)
        
        # Main canvas with scrollbar
        main_frame = tk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Canvas for scrolling
        self.canvas = tk.Canvas(main_frame, bg="#f5f5f5", highlightthickness=0)
        scrollbar = ttk.Scrollbar(main_frame, orient="vertical", command=self.canvas.yview)
        
        # Grid container
        self.grid_frame = tk.Frame(self.canvas, bg="#f5f5f5")
        
        # Configure canvas
        self.canvas.create_window((0, 0), window=self.grid_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=scrollbar.set)
        
        # Pack canvas and scrollbar
        self.canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Bind mousewheel to canvas
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)
        
        # Update scroll region when grid changes
        self.grid_frame.bind("<Configure>", lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
        
        # Bind window resize to adjust columns
        self.root.bind("<Configure>", self.on_window_resize)
    
    def calculate_columns(self):
        """Calculate number of columns based on window width"""
        window_width = self.root.winfo_width()
        # Calculate size per image based on zoom level
        base_size = 200
        zoom_multiplier = self.zoom_level / 100 if hasattr(self, 'zoom_level') else 1.0
        image_size = int(base_size * zoom_multiplier)
        # Each image takes image_size + 10px padding on each side + extra margin
        size_per_image = image_size + 20  # Increased from 10 to 20 for safety
        # Add more margin for scrollbar and borders
        available_width = window_width - 60  # Increased from 40 to 60
        cols = max(1, available_width // size_per_image)
        return cols
    
    def on_window_resize(self, event):
        """Handle window resize to adjust columns"""
        # Only respond to root window resize events
        if event.widget != self.root:
            return
        
        # Calculate new column count
        new_cols = self.calculate_columns()
        
        # Only refresh if column count changed
        if not hasattr(self, '_current_cols') or self._current_cols != new_cols:
            self._current_cols = new_cols
            # Refresh grid if images are loaded
            if hasattr(self, 'image_widgets') and len(self.image_widgets) > 0:
                self.refresh_grid()
                # Recache positions after layout change
                self.root.after(200, self.recache_positions)
                # Update scroll region to match new layout
                self.root.after(250, self.update_scroll_region)
    
    def recache_positions(self):
        """Recache widget positions after layout change"""
        if not hasattr(self, 'image_widgets'):
            return
        
        self.root.update_idletasks()
        
        # Cache grid frame position
        self.cached_grid_x = self.grid_frame.winfo_rootx()
        self.cached_grid_y = self.grid_frame.winfo_rooty()
        
        # Cache all widget positions
        for widget_info in self.image_widgets:
            frame = widget_info['frame']
            widget_info['cached_x'] = frame.winfo_x()
            widget_info['cached_y'] = frame.winfo_y()
            widget_info['cached_width'] = frame.winfo_width()
            widget_info['cached_height'] = frame.winfo_height()
    
    def on_zoom_change(self, value):
        """Handle zoom slider change"""
        new_zoom = int(float(value))
        if new_zoom != self.zoom_level:
            self.zoom_level = new_zoom
            self.zoom_display.config(text=f"{self.zoom_level}%")
            
            # Quick update: just resize frames (fast)
            self.apply_zoom_frames_only()
            
            # Debounce image resizing (expensive operation)
            if hasattr(self, '_zoom_timer'):
                self.root.after_cancel(self._zoom_timer)
            # Resize actual images after 300ms of no slider movement
            self._zoom_timer = self.root.after(300, self.apply_zoom_images)
    
    def apply_zoom_frames_only(self):
        """Quickly resize frames without touching images (fast)"""
        if not hasattr(self, 'image_widgets') or len(self.image_widgets) == 0:
            return
        
        # Calculate new size
        base_size = 200
        new_size = int(base_size * (self.zoom_level / 100))
        
        # Only update frame sizes (very fast)
        for widget_info in self.image_widgets:
            frame = widget_info['frame']
            frame.config(width=new_size, height=new_size)
        
        # Update drop indicator height
        self.drop_indicator_height = new_size + 20
        if hasattr(self, 'drop_indicator'):
            self.drop_indicator.config(height=self.drop_indicator_height)
        
        # Force column recalculation
        self._current_cols = self.calculate_columns()
        
        # Quick grid refresh and update scroll region
        self.root.after(10, lambda: [self.refresh_grid(), self.root.after(50, self.update_scroll_region)])
    
    def apply_zoom_images(self):
        """Resize actual images (slower, called after slider stops)"""
        if not hasattr(self, 'image_widgets') or len(self.image_widgets) == 0:
            return
        
        # Calculate new size
        base_size = 200
        new_size = int(base_size * (self.zoom_level / 100))
        
        # Resize images from cache
        for widget_info in self.image_widgets:
            if 'original_image' in widget_info:
                try:
                    img = widget_info['original_image'].copy()
                    img.thumbnail((new_size, new_size), Image.Resampling.LANCZOS)
                    photo = ImageTk.PhotoImage(img)
                    
                    # Find and update the image label
                    frame = widget_info['frame']
                    for child in frame.winfo_children():
                        if isinstance(child, tk.Label) and hasattr(child, 'image'):
                            child.config(image=photo)
                            child.image = photo
                            break
                except Exception:
                    pass
        
        # Recache positions after images are resized
        self.root.after(100, lambda: [self.recache_positions(), self.update_scroll_region()])
    
    def apply_zoom(self):
        """Apply current zoom level to all images (full update)"""
        self.apply_zoom_frames_only()
        self.apply_zoom_images()
    
    def update_scroll_region(self):
        """Update canvas scroll region to match actual content size"""
        self.root.update_idletasks()
        
        # Get the bounding box of the grid frame
        bbox = self.canvas.bbox("all")
        if bbox:
            # Set scroll region to the actual content
            self.canvas.configure(scrollregion=bbox)
            
            # If content height is less than canvas height, disable vertical scrolling
            canvas_height = self.canvas.winfo_height()
            content_height = bbox[3] - bbox[1]
            
            if content_height <= canvas_height:
                # Content fits, set scroll region to canvas size to disable scrolling
                self.canvas.configure(scrollregion=(0, 0, bbox[2], canvas_height))
    
    def show_loading_overlay(self):
        """Show loading overlay on top of everything"""
        # Create loading overlay
        self.loading_overlay = tk.Frame(
            self.root,
            bg="#f5f5f5"
        )
        self.loading_overlay.place(relx=0, rely=0, relwidth=1, relheight=1)
        
        loading_label = tk.Label(
            self.loading_overlay,
            text="Loading images...",
            font=("Arial", 16, "bold"),
            bg="#f5f5f5",
            fg="#666"
        )
        loading_label.place(relx=0.5, rely=0.5, anchor="center")
        
        # Ensure overlay is on top
        self.loading_overlay.lift()
    
    def _on_mousewheel(self, event):
        self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
    
    def load_images(self):
        # Show loading overlay immediately
        self.show_loading_overlay()
        
        self.image_widgets = []
        
        # Calculate grid dimensions - responsive based on window width
        cols = self.calculate_columns()
        self._current_cols = cols
        
        for idx, image_file in enumerate(self.image_files):
            row = idx // cols
            col = idx % cols
            
            # Try to find corresponding thumbnail
            thumb_file = self.thumb_dir / image_file.name
            if not thumb_file.exists():
                # Try stripping prefix if main file has one but thumb doesn't
                # e.g. main="01_img.jpg", thumb="img.jpg"
                clean_name = image_file.name
                if len(clean_name) > 3 and clean_name[:2].isdigit() and clean_name[2] == '_':
                    clean_name = clean_name[3:]
                    alt_thumb = self.thumb_dir / clean_name
                    if alt_thumb.exists():
                        thumb_file = alt_thumb
            
            # Load image (use thumb if available, else full res)
            img_path = thumb_file if thumb_file.exists() else image_file
            
            # Create frame for image
            frame = tk.Frame(
                self.grid_frame,
                bg="white",
                relief=tk.FLAT,
                borderwidth=1,
                cursor="hand2",
                width=200,
                height=200
            )
            frame.grid(row=row, column=col, padx=5, pady=5, sticky="nsew")  # Reduced padding from 10 to 5
            frame.grid_propagate(False)  # Prevent frame from resizing
            frame.pack_propagate(False)  # Prevent frame from resizing
            
            # Load image safely ensuring file handle is closed
            try:
                with Image.open(img_path) as file_img:
                    file_img.load()  # Force load data
                    img = file_img.copy()  # Create independent copy
                
                # Make another copy for the zoom cache
                original_img = img.copy()
                
                # Resize for thumbnail
                img.thumbnail((200, 200), Image.Resampling.LANCZOS)
                photo = ImageTk.PhotoImage(img)
                
                img_label = tk.Label(frame, image=photo, bg="white")
                img_label.image = photo  # Keep a reference
                img_label.pack(expand=True)
            except Exception as e:
                # Fallback
                img_label = tk.Label(frame, text="Image", bg="white")
                img_label.pack(expand=True)
            
            # Position number overlay
            pos_label = tk.Label(
                frame,
                text=str(idx + 1),
                font=("Arial", 16, "bold"),
                bg="#2196F3",
                fg="white",
                padx=8,
                pady=4
            )
            pos_label.place(x=5, y=5)
            
            # Store widget info (bind events after loading)
            self.image_widgets.append({
                'frame': frame,
                'pos_label': pos_label,
                'file': image_file,
                'thumb_file': thumb_file if thumb_file.exists() else None,
                'original_image': original_img,  # Cache for fast zoom
                'row': row,
                'col': col
            })
        
        # Mark images as loaded
        self.images_loaded = True
        
        # Now bind drag events after all images are loaded
        for idx, widget in enumerate(self.image_widgets):
            self.bind_drag_events(widget['frame'], idx)
        
        # Force UI to complete all pending updates
        self.root.update_idletasks()
        
        # Cache widget positions after grid is stable
        def cache_positions_and_remove_overlay():
            # Force another update to ensure everything is rendered
            self.root.update_idletasks()
            
            # Cache grid frame position
            self.cached_grid_x = self.grid_frame.winfo_rootx()
            self.cached_grid_y = self.grid_frame.winfo_rooty()
            
            # Cache all widget positions now that grid is stable
            for widget_info in self.image_widgets:
                frame = widget_info['frame']
                widget_info['cached_x'] = frame.winfo_x()
                widget_info['cached_y'] = frame.winfo_y()
                widget_info['cached_width'] = frame.winfo_width()
                widget_info['cached_height'] = frame.winfo_height()
            
            if hasattr(self, 'loading_overlay'):
                self.loading_overlay.destroy()
        
        self.root.after(500, cache_positions_and_remove_overlay)
    
    def bind_drag_events(self, widget, index):
        """Bind drag events to widget and all children"""
        # Store index on widget for easy lookup (use drag_index to avoid conflicts with built-in index)
        widget.drag_index = index
        
        widget.bind("<Button-1>", lambda e, i=index: self.start_drag(e, i))
        widget.bind("<B1-Motion>", lambda e, i=index: self.on_drag(e, i))
        widget.bind("<ButtonRelease-1>", lambda e, i=index: self.end_drag(e, i))
        
        for child in widget.winfo_children():
            child.drag_index = index
            child.bind("<Button-1>", lambda e, i=index: self.start_drag(e, i))
            child.bind("<B1-Motion>", lambda e, i=index: self.on_drag(e, i))
            child.bind("<ButtonRelease-1>", lambda e, i=index: self.end_drag(e, i))
    
    def start_drag(self, event, index):
        # Don't allow drag if images are still loading
        if not self.images_loaded:
            return
        
        self.drag_start_index = index
        self.drag_widget = self.image_widgets[index]['frame']
        self.drag_widget.config(bg="#bbdefb", relief=tk.FLAT, borderwidth=2)  # Light blue
        
        # Create floating drag image
        try:
            # Get the image from the frame
            img_label = None
            for child in self.drag_widget.winfo_children():
                if isinstance(child, tk.Label) and hasattr(child, 'image'):
                    img_label = child
                    break
            
            if img_label and hasattr(img_label, 'image'):
                # Create toplevel window for floating image
                self.drag_image_window = tk.Toplevel(self.root)
                self.drag_image_window.overrideredirect(True)  # Remove window decorations
                self.drag_image_window.attributes('-alpha', 0.7)  # 70% opacity
                self.drag_image_window.attributes('-topmost', True)  # Always on top
                
                # Create label with the image
                drag_label = tk.Label(
                    self.drag_image_window,
                    image=img_label.image,
                    bg="white",
                    relief=tk.RAISED,
                    borderwidth=2
                )
                drag_label.pack()
                
                # Update to get actual size
                self.drag_image_window.update_idletasks()
                img_width = self.drag_image_window.winfo_width()
                
                # Position centered horizontally on cursor, slightly below
                x_pos = event.x_root - (img_width // 2)
                y_pos = event.y_root + 10
                self.drag_image_window.geometry(f"+{x_pos}+{y_pos}")
        except Exception:
            # If floating image creation fails, continue without it
            pass
    
    def on_drag(self, event, current_index):
        if self.drag_start_index is None or not self.images_loaded:
            return
        
        # Move floating drag image with cursor (centered horizontally)
        if hasattr(self, 'drag_image_window') and self.drag_image_window.winfo_exists():
            img_width = self.drag_image_window.winfo_width()
            x_pos = event.x_root - (img_width // 2)
            y_pos = event.y_root + 10
            self.drag_image_window.geometry(f"+{x_pos}+{y_pos}")
        
        # Auto-scroll when dragging near edges with smooth acceleration
        canvas_y = event.y_root - self.canvas.winfo_rooty()
        canvas_height = self.canvas.winfo_height()
        scroll_zone = 100  # pixels from edge to trigger scroll
        
        # Store current scroll state for timer
        self._current_scroll_speed = 0.0
        
        if canvas_y < scroll_zone:
            # Near top - scroll up with acceleration
            distance_from_edge = canvas_y
            speed_factor = 1.0 - (distance_from_edge / scroll_zone)
            self._current_scroll_speed = -(speed_factor ** 2 * 1)  # Max 1 unit
        elif canvas_y > canvas_height - scroll_zone:
            # Near bottom - scroll down with acceleration
            distance_from_edge = (canvas_height - canvas_y)
            speed_factor = 1.0 - (distance_from_edge / scroll_zone)
            self._current_scroll_speed = (speed_factor ** 2 * 1)  # Max 1 unit
        
        # Start continuous scroll timer if not already running
        if not hasattr(self, '_scroll_timer_running') or not self._scroll_timer_running:
            if self._current_scroll_speed != 0:
                self._scroll_timer_running = True
                self._continuous_scroll()
        
        # Update drop indicator position
        self._update_drop_indicator(event)
    
    def _continuous_scroll(self):
        """Continuously scroll while in scroll zone"""
        if not hasattr(self, '_current_scroll_speed'):
            self._scroll_timer_running = False
            return
        
        # Initialize accumulator if needed
        if not hasattr(self, '_scroll_accumulator'):
            self._scroll_accumulator = 0.0
        
        # Accumulate and scroll
        if self._current_scroll_speed != 0 and self.drag_start_index is not None:
            self._scroll_accumulator += self._current_scroll_speed
            if abs(self._scroll_accumulator) >= 1.0:
                scroll_amount = int(self._scroll_accumulator)
                self.canvas.yview_scroll(scroll_amount, "units")
                self._scroll_accumulator -= scroll_amount
            
            # Continue scrolling after 50ms
            self.root.after(50, self._continuous_scroll)
        else:
            # Stop scrolling
            self._scroll_timer_running = False
            self._scroll_accumulator = 0.0
    
    def _update_drop_indicator(self, event):
        """Update drop indicator position based on mouse position"""
        # Get widget under cursor
        x, y = event.x_root, event.y_root
        target_widget = event.widget.winfo_containing(x, y)
        
        # Find the frame this widget belongs to
        drop_index = None
        target_frame = None
        while target_widget:
            if hasattr(target_widget, 'drag_index'):
                drop_index = target_widget.drag_index
                target_frame = self.image_widgets[drop_index]['frame']
                break
            target_widget = target_widget.master
        
        # Only update if drop target changed
        if drop_index is not None and drop_index != self.drag_start_index and target_frame:
            # Get target frame info for cached positions
            target_frame_info = self.image_widgets[drop_index]
            
            # Make sure cached positions exist
            if 'cached_x' not in target_frame_info:
                return
            
            # Calculate which side using cached positions
            # Convert cached grid position to screen coordinates
            frame_x = self.cached_grid_x + target_frame_info['cached_x']
            frame_width = target_frame_info['cached_width']
            relative_x = (x - frame_x) / frame_width if frame_width > 0 else 0.5
            insert_before = relative_x < 0.5
            
            # Check if we need to update (prevent flickering)
            current_state = (drop_index, insert_before)
            if not hasattr(self, '_last_drop_state') or self._last_drop_state != current_state:
                self._last_drop_state = current_state
                
                # Clear all highlights
                for i, w in enumerate(self.image_widgets):
                    if i != self.drag_start_index:
                        w['frame'].config(bg="white", borderwidth=1, relief=tk.FLAT)
                
                # Calculate insertion position in grid
                cols = self._current_cols if hasattr(self, '_current_cols') else 7
                insert_index = drop_index if insert_before else drop_index + 1
                
                # Adjust for drag source removal
                if self.drag_start_index < insert_index:
                    insert_index -= 1
                
                # Only show indicator if position will actually change
                if insert_index == self.drag_start_index:
                    # Hide indicator
                    if hasattr(self, 'drop_indicator'):
                        self.drop_indicator.place_forget()
                    return
                
                # Get cached positions (stable, won't cause layout recalculation)
                target_x = target_frame_info['cached_x']
                target_y = target_frame_info['cached_y']
                target_width = target_frame_info['cached_width']
                
                # Calculate center position between images using cached positions
                if insert_before:
                    # Find the frame to the left (if any)
                    if drop_index > 0 and drop_index % cols != 0:
                        left_info = self.image_widgets[drop_index - 1]
                        left_x = left_info['cached_x']
                        left_width = left_info['cached_width']
                        # Center between left frame and target frame
                        center_x = (left_x + left_width + target_x) / 2
                    else:
                        # First in row - place at left edge
                        center_x = target_x - 8
                else:
                    # Find the frame to the right (if any)
                    if drop_index < len(self.image_widgets) - 1 and (drop_index + 1) % cols != 0:
                        right_info = self.image_widgets[drop_index + 1]
                        right_x = right_info['cached_x']
                        # Center between target frame and right frame
                        center_x = (target_x + target_width + right_x) / 2
                    else:
                        # Last in row - place at right edge
                        center_x = target_x + target_width + 2
                
                # Create or move persistent drop indicator
                if not hasattr(self, 'drop_indicator'):
                    self.drop_indicator = tk.Frame(
                        self.grid_frame,
                        width=6,
                        height=self.drop_indicator_height,
                        bg="#f44336",  # Red
                        relief=tk.FLAT,
                        borderwidth=0
                    )
                
                # Move indicator to new position
                self.drop_indicator.place(x=center_x - 3, y=target_y - 10)
        elif drop_index is None or drop_index == self.drag_start_index:
            # Clear state when not over a valid target
            if hasattr(self, '_last_drop_state'):
                delattr(self, '_last_drop_state')
            # Clear all highlights and indicators
            for i, w in enumerate(self.image_widgets):
                if i != self.drag_start_index:
                    w['frame'].config(bg="white", borderwidth=1, relief=tk.FLAT)
            # Hide indicator
            if hasattr(self, 'drop_indicator'):
                self.drop_indicator.place_forget()
    
    def end_drag(self, event, current_index):
        if self.drag_start_index is None:
            return
        
        # Get widget under cursor
        x, y = event.x_root, event.y_root
        target_widget = event.widget.winfo_containing(x, y)
        
        # Find the frame this widget belongs to
        drop_index = None
        target_frame = None
        while target_widget:
            if hasattr(target_widget, 'drag_index'):
                drop_index = target_widget.drag_index
                target_frame = self.image_widgets[drop_index]['frame']
                break
            target_widget = target_widget.master
        
        # Calculate insertion position
        if drop_index is not None and drop_index != self.drag_start_index and target_frame:
            # Determine which side based on mouse position
            frame_x = target_frame.winfo_rootx()
            frame_width = target_frame.winfo_width()
            relative_x = (x - frame_x) / frame_width if frame_width > 0 else 0.5
            
            # Calculate final insertion index
            # If dropping on right half, insert after (drop_index + 1)
            # If dropping on left half, insert before (drop_index)
            insert_index = drop_index
            if relative_x >= 0.5:
                # Right side - insert after
                insert_index = drop_index + 1
            
            # Remove item from current position
            item = self.image_widgets.pop(self.drag_start_index)
            file = self.image_files.pop(self.drag_start_index)
            
            # Adjust insert index if we removed an item before it
            if self.drag_start_index < insert_index:
                insert_index -= 1
            
            # Insert at new position
            self.image_widgets.insert(insert_index, item)
            self.image_files.insert(insert_index, file)
            
            # Refresh grid
            self.refresh_grid()
        
        # Hide drop indicator
        if hasattr(self, 'drop_indicator'):
            self.drop_indicator.place_forget()
        
        # Destroy floating drag image
        if hasattr(self, 'drag_image_window'):
            try:
                self.drag_image_window.destroy()
            except:
                pass
            delattr(self, 'drag_image_window')
        
        # Stop continuous scroll
        self._current_scroll_speed = 0.0
        self._scroll_timer_running = False
        
        # Reset
        self.drag_start_index = None
        self.drag_widget = None
        
        # Reset backgrounds
        for w in self.image_widgets:
            w['frame'].config(bg="white", borderwidth=1, relief=tk.FLAT)
    
    def refresh_grid(self):
        cols = self._current_cols if hasattr(self, '_current_cols') else self.calculate_columns()
        
        for idx, widget in enumerate(self.image_widgets):
            row = idx // cols
            col = idx % cols
            
            # Update position
            widget['row'] = row
            widget['col'] = col
            widget['pos_label'].config(text=str(idx + 1))
            
            # Regrid
            widget['frame'].grid(row=row, column=col, padx=10, pady=10, sticky="nsew")
            
            # Rebind events with new index
            self.bind_drag_events(widget['frame'], idx)
    
    def apply_changes(self):
        result = messagebox.askyesno(
            "Confirm Changes",
            f"Rename {len(self.image_widgets)} images with number prefixes?\n\n"
            "This will rename both full resolution images and thumbnails.\n"
            "A backup list will be created."
        )
        
        if not result:
            return
        
        try:
            # Create backup
            backup_dir = self.image_dir / "_backup_original_names"
            backup_dir.mkdir(exist_ok=True)
            
            backup_file = backup_dir / "original_names.txt"
            with open(backup_file, 'w') as f:
                for idx, widget in enumerate(self.image_widgets):
                    img_file = widget['file']
                    f.write(f"{idx + 1}. {img_file.name}\n")
            
            # Helper to clean filename
            def get_clean_name(name):
                # Remove number prefix if exists (e.g. 01_image.jpg -> image.jpg)
                if len(name) > 3 and name[:2].isdigit() and name[2] == '_':
                    return name[3:]
                return name

            # 1. Rename ALL files to temporary names to avoid conflicts
            # We track (temp_full_path, temp_thumb_path)
            temp_files = []
            
            for idx, widget in enumerate(self.image_widgets):
                # Full res
                original_full = widget['file']
                temp_full = self.image_dir / f"_temp_{idx}_{original_full.name}"
                
                # Check actual file existence before rename (in case of double run)
                if original_full.exists():
                    original_full.rename(temp_full)
                
                # Thumb
                original_thumb = widget.get('thumb_file')
                temp_thumb = None
                if original_thumb and original_thumb.exists():
                    temp_thumb = self.thumb_dir / f"_temp_{idx}_{original_thumb.name}"
                    original_thumb.rename(temp_thumb)
                
                temp_files.append((temp_full, temp_thumb))
            
            # 2. Rename from temp to final numbered names
            for idx, (temp_full, temp_thumb) in enumerate(temp_files):
                # Extract original name (without temp prefix)
                # _temp_0_filename.jpg
                original_name_with_prefix = temp_full.name
                original_base = original_name_with_prefix.replace(f"_temp_{idx}_", "")
                
                # Clean clean name (remove old 01_ prefix)
                final_base_name = get_clean_name(original_base)
                
                # Construct new names
                new_full_name = self.image_dir / f"{idx + 1:02d}_{final_base_name}"
                
                if temp_full.exists():
                    temp_full.rename(new_full_name)
                    
                if temp_thumb and temp_thumb.exists():
                    new_thumb_name = self.thumb_dir / f"{idx + 1:02d}_{final_base_name}"
                    temp_thumb.rename(new_thumb_name)
            
            messagebox.showinfo(
                "Success",
                f"Renamed {len(self.image_widgets)} images and thumbnails!\n\nBackup: {backup_file}"
            )
            
            self.root.destroy()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to rename:\n{str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    
    # Handle Ctrl+C gracefully
    def signal_handler(sig, frame):
        root.quit()
        root.destroy()
    
    signal.signal(signal.SIGINT, signal_handler)
    
    # Periodic update to allow signal handling
    def check_signals():
        root.after(100, check_signals)
    
    app = ImageSorter(root)
    check_signals()
    
    try:
        root.mainloop()
    except KeyboardInterrupt:
        root.quit()
        root.destroy()
