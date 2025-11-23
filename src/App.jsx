import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Download,
  Palette,
  Sparkles,
  Image as ImageIcon,
  Copy,
  Check
} from 'lucide-react';

// --- Constants ---

const FONTS = [
  { name: 'Inter', value: 'font-sans', label: 'Modern', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap' },
  { name: 'Playfair Display', value: 'font-serif', label: 'Elegant', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap' },
  { name: 'JetBrains Mono', value: 'font-mono', label: 'Code', url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap' },
  { name: 'Roboto', value: 'font-roboto', label: 'Clean', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' },
  { name: 'Poppins', value: 'font-poppins', label: 'Geometric', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap' },
  { name: 'Lora', value: 'font-lora', label: 'Serif', url: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap' },
];


const TEXT_PRESETS = [
  { name: 'Deep Slate', value: '#1e293b' }, // Default Dark
  { name: 'Midnight', value: '#172554' },   // Deep Blue
  { name: 'Charcoal', value: '#334155' },   // Softer Dark
  { name: 'Forest', value: '#064e3b' },     // Dark Green
  { name: 'Maroon', value: '#881337' },     // Dark Red
  { name: 'Chocolate', value: '#451a03' },  // Dark Brown
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Soft Gray', value: '#f1f5f9' },
  { name: 'Cream', value: '#fefce8' },
];

const PRESET_GRADIENTS = [
  { name: 'Apple Mesh', value: 'linear-gradient(135deg, #ffe4e6 0%, #e9d5ff 50%, #dbeafe 100%)' },
  { name: 'Soft Air', value: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)' },
  { name: 'Nordic', value: 'linear-gradient(to right, #d4fc79 0%, #96e6a1 100%)' },
  { name: 'Sunset', value: 'linear-gradient(to top, #fdcbf1 0%, #e6dee9 100%)' },
  { name: 'Oceanic', value: 'linear-gradient(225deg, #60a5fa 0%, #5eead4 50%, #34d399 100%)' },
  { name: 'Midnight', value: 'linear-gradient(135deg, #0f172a 0%, #3b0764 50%, #0f172a 100%)' },
  { name: 'Deep Space', value: 'linear-gradient(to top, #09203f 0%, #537895 100%)' },
  { name: 'Clean', value: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)' },
];

const DEFAULT_MARKDOWN = `# The Glass Effect

> "Simplicity is the ultimate sophistication."

Notice how the **background colors** blur beautifully behind this card.

$$ E = mc^2 $$

### Python Code
\`\`\`python
def glass_morph():
    return "Crystal Clear"
\`\`\`
`;

// --- Hooks ---

const useScript = (src) => {
  const [status, setStatus] = useState(src ? 'loading' : 'idle');
  useEffect(() => {
    if (!src) { setStatus('idle'); return; }
    let script = document.querySelector(`script[src="${src}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-status', 'loading');
      document.body.appendChild(script);
      const setAttributeFromEvent = (event) => {
        script.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error');
        setStatus(event.type === 'load' ? 'ready' : 'error');
      };
      script.addEventListener('load', setAttributeFromEvent);
      script.addEventListener('error', setAttributeFromEvent);
    } else {
      setStatus(script.getAttribute('data-status'));
    }
  }, [src]);
  return status;
};

const useStyle = (href, id) => {
  useEffect(() => {
    if (!href) return;

    let link = id ? document.getElementById(id) : document.querySelector(`link[href="${href}"]`);

    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      if (id) link.id = id;
      document.head.appendChild(link);
    } else if (id && link.href !== href) {
      link.href = href;
    }
  }, [href, id]);
};

// --- Main Component ---

const App = () => {
  // --- State ---
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [parsedHtml, setParsedHtml] = useState('');

  // Style State
  const [bgType, setBgType] = useState('gradient');
  const [selectedGradient, setSelectedGradient] = useState(PRESET_GRADIENTS[0]); // Apple Mesh default for better blur visibility
  const [customGradStart, setCustomGradStart] = useState('#6366f1');
  const [customGradEnd, setCustomGradEnd] = useState('#a855f7');
  const [customGradDir, setCustomGradDir] = useState('135deg');

  const [bgImage, setBgImage] = useState(null);
  const [bgBrightness, setBgBrightness] = useState(100);

  const [font, setFont] = useState(FONTS[0]);
  const [textColor, setTextColor] = useState('#1e293b');
  const [themeMode, setThemeMode] = useState('light');

  // Glass Properties
  const [blur, setBlur] = useState(40);
  const [opacity, setOpacity] = useState(60); // Lower opacity = more visible blur
  const [padding, setPadding] = useState(64);
  const [borderRadius, setBorderRadius] = useState(24);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isResizing, setIsResizing] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const previewRef = useRef(null);
  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- Load Libraries ---
  const markedStatus = useScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
  const katexStatus = useScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js');
  const autoRenderStatus = useScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js');
  const highlightStatus = useScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js');
  // SWITCHED: using dom-to-image for better CSS filter support
  const domToImageStatus = useScript('https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js');

  useStyle('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');

  // Dynamic Code Theme
  const codeThemeUrl = useMemo(() => {
    return themeMode === 'dark'
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
  }, [themeMode]);

  useStyle(codeThemeUrl, 'hljs-theme');

  // Load all fonts
  useEffect(() => {
    FONTS.forEach(font => {
      if (font.url) {
        const link = document.createElement('link');
        link.href = font.url;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    });
  }, []);

  // --- Markdown Processing ---

  useEffect(() => {
    if (markedStatus === 'ready' && window.marked) {
      window.marked.setOptions({
        gfm: true,
        breaks: true,
      });

      // --- MATH SHIELDING ---
      const mathBlocks = [];
      let protectedText = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
        mathBlocks.push(match);
        return `%%%MATH_BLOCK_${mathBlocks.length - 1}%%%`;
      });

      protectedText = protectedText.replace(/\$([^$\n]+?)\$/g, (match) => {
        mathBlocks.push(match);
        return `%%%MATH_INLINE_${mathBlocks.length - 1}%%%`;
      });

      let html = window.marked.parse(protectedText);

      html = html.replace(/%%%MATH_(BLOCK|INLINE)_(\d+)%%%/g, (match, type, index) => {
        return mathBlocks[parseInt(index)];
      });

      setParsedHtml(html);
    }
  }, [markdown, markedStatus]);

  // --- Post-Processing ---

  useEffect(() => {
    if (!contentRef.current) return;

    const renderExtras = () => {
      if (
        katexStatus === 'ready' &&
        autoRenderStatus === 'ready' &&
        window.renderMathInElement &&
        window.katex &&
        typeof window.katex.render === 'function'
      ) {
        try {
          window.renderMathInElement(contentRef.current, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false,
            output: 'html',
          });
        } catch (e) { console.warn("Math render error", e); }
      }

      if (highlightStatus === 'ready' && window.hljs) {
        const blocks = contentRef.current.querySelectorAll('pre code');
        blocks.forEach((block) => {
          block.removeAttribute('data-highlighted');
          window.hljs.highlightElement(block);
        });
      }
    };

    const timer = setTimeout(renderExtras, 50);
    return () => clearTimeout(timer);

  }, [parsedHtml, katexStatus, autoRenderStatus, highlightStatus]);

  // --- Resize Handlers ---

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      // Calculate new size based on mouse position relative to the preview container
      // We need to find the preview container's bounds
      // Since the resize handle is inside the previewRef, we can use that
      if (previewRef.current) {
        const rect = previewRef.current.getBoundingClientRect();
        // We want the bottom-right corner to follow the mouse
        // But we need to account for the fact that the mouse might be outside the container
        // The new width is the mouse X minus the container's left position
        // The new height is the mouse Y minus the container's top position

        // However, since we are centered, it might be tricky. 
        // Let's assume the resize handle is at the bottom right of the element itself.
        // A simpler way:
        // New Width = Current Width + Mouse Delta X
        // But we don't have delta easily without previous position.

        // Better approach:
        // The element top-left is fixed relative to the viewport during resize? 
        // No, it's centered. This makes resizing tricky if we just use mouse position.
        // If it's centered, increasing width moves both left and right edges.

        // Let's try a simpler approach:
        // Just use the mouse movement to add to width/height.
        // We need to track previous mouse position.
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // We need a ref to store the start position of the mouse and the start size
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: canvasSize.width,
      h: canvasSize.height
    };
  };

  const handleWindowMouseMove = (e) => {
    if (!isResizing) return;

    const dx = (e.clientX - resizeStartRef.current.x) * 2; // Multiply by 2 because it's centered
    const dy = (e.clientY - resizeStartRef.current.y) * 2;

    setCanvasSize({
      width: Math.max(300, resizeStartRef.current.w + dx),
      height: Math.max(200, resizeStartRef.current.h + dy)
    });
  };

  // --- Handlers ---

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBgImage(e.target.result);
        setBgType('image');
      };
      reader.readAsDataURL(file);
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleExport = async () => {
    if (domToImageStatus !== 'ready' || !previewRef.current) return;
    setIsExporting(true);

    // We need to wait a moment to ensure the spinner state renders before blocking thread
    setTimeout(async () => {
      try {
        // Scale up for retina display simulation
        const scale = 3;
        const node = previewRef.current;
        const exportOptions = {
          quality: 0.95,
          cacheBust: true,
          width: node.offsetWidth * scale,
          height: node.offsetHeight * scale,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${node.offsetWidth}px`,
            height: `${node.offsetHeight}px`
          }
        };

        // domtoimage usually handles filters better than html2canvas
        const dataUrl = await window.domtoimage.toPng(node, exportOptions);

        const link = document.createElement('a');
        link.download = `markframe-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Export failed", err);
        alert("Export failed. Please try a simpler background or Chrome browser.");
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  const handleCopy = async () => {
    if (domToImageStatus !== 'ready' || !previewRef.current) return;
    setIsCopying(true);

    setTimeout(async () => {
      try {
        const scale = 2; // Slightly lower scale for clipboard to ensure performance
        const node = previewRef.current;
        const exportOptions = {
          quality: 0.95,
          cacheBust: true,
          width: node.offsetWidth * scale,
          height: node.offsetHeight * scale,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${node.offsetWidth}px`,
            height: `${node.offsetHeight}px`
          }
        };

        const blob = await window.domtoimage.toBlob(node, exportOptions);
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);

        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Copy failed", err);
        alert("Copy failed. Please try again.");
      } finally {
        setIsCopying(false);
      }
    }, 100);
  };

  const getBackgroundStyle = () => {
    if (bgType === 'image' && bgImage) {
      return {
        backgroundImage: `url(${bgImage})`,
        filter: `brightness(${bgBrightness}%)`
      };
    }
    if (bgType === 'custom') {
      return { backgroundImage: `linear-gradient(${customGradDir}, ${customGradStart}, ${customGradEnd})` };
    }
    return { backgroundImage: selectedGradient.value };
  };

  const parsedHtmlMemo = useMemo(() => ({ __html: parsedHtml }), [parsedHtml]);

  // Shared styles for preview/export so blur works in screenshots (backdrop-filter isn't captured)
  const backgroundStyle = useMemo(() => ({
    ...getBackgroundStyle(),
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }), [bgType, selectedGradient, customGradStart, customGradEnd, customGradDir, bgImage, bgBrightness]);

  const glassTintColor = useMemo(() => (
    themeMode === 'light'
      ? `rgba(255, 255, 255, ${opacity / 100})`
      : `rgba(15, 23, 42, ${opacity / 100})`
  ), [themeMode, opacity]);

  const glassBlurStyle = useMemo(() => {
    const filterParts = [];
    if (backgroundStyle.filter) filterParts.push(backgroundStyle.filter);
    filterParts.push(`blur(${blur}px)`);

    return {
      backgroundImage: backgroundStyle.backgroundImage,
      backgroundSize: backgroundStyle.backgroundSize,
      backgroundPosition: backgroundStyle.backgroundPosition,
      filter: filterParts.join(' '),
    };
  }, [backgroundStyle, blur]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden flex flex-col md:flex-row">

      {/* --- Sidebar --- */}
      <div className="w-full md:w-96 bg-white border-r border-slate-200 flex flex-col h-[45vh] md:h-screen z-10 shadow-xl">

        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            <span className="font-bold text-lg text-slate-900 tracking-tight">MarkFrame</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={isCopying || isExporting}
              className={`
                    p-2 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2
                    ${copySuccess ? 'bg-green-500 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}
                `}
              title="Copy to Clipboard"
            >
              {isCopying ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : copySuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || isCopying}
              className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
              title="Export as PNG"
            >
              {isExporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
              <span className="text-xs font-bold hidden md:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-2 mx-4 mt-4 bg-slate-100 rounded-xl">
          {['edit', 'style'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

          {activeTab === 'edit' && (
            <div className="space-y-4 h-full flex flex-col">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 w-full bg-slate-50 border-slate-200 border rounded-xl p-4 text-sm font-mono text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none leading-relaxed"
                placeholder="Type Markdown here..."
              />
              <div className="flex gap-2 justify-center text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                <span>**Bold**</span>
                <span>$$Math$$</span>
                <span>`Code`</span>
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-8 pb-12">

              {/* Background Section */}
              <div className="space-y-4">
                <label className="section-label">Background</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_GRADIENTS.map((g) => (
                    <button
                      key={g.name}
                      onClick={() => { setSelectedGradient(g); setBgType('gradient'); }}
                      className={`aspect-square rounded-xl ring-offset-2 transition-all ${bgType === 'gradient' && selectedGradient.name === g.name ? 'ring-2 ring-indigo-500 scale-105 shadow-lg' : 'hover:scale-105 shadow-sm'}`}
                      style={{ background: g.value }}
                      title={g.name}
                    />
                  ))}
                  <button
                    onClick={() => setBgType('custom')}
                    className={`aspect-square rounded-xl ring-offset-2 flex items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 transition-all ${bgType === 'custom' ? 'ring-2 ring-indigo-500 scale-105 border-solid border-transparent bg-white' : 'hover:scale-105 hover:bg-slate-200'}`}
                    title="Custom Gradient"
                  >
                    <Palette className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                {/* Custom Gradient Controls */}
                {bgType === 'custom' && (
                  <div className="p-3 bg-slate-50 rounded-xl space-y-3 border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex gap-2">
                      <input type="color" value={customGradStart} onChange={e => setCustomGradStart(e.target.value)} className="h-8 w-full cursor-pointer rounded" />
                      <input type="color" value={customGradEnd} onChange={e => setCustomGradEnd(e.target.value)} className="h-8 w-full cursor-pointer rounded" />
                    </div>
                    <select
                      value={customGradDir}
                      onChange={e => setCustomGradDir(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-300 bg-white outline-none focus:border-indigo-500"
                    >
                      <option value="to right">Horizontal</option>
                      <option value="to bottom">Vertical</option>
                      <option value="135deg">Diagonal</option>
                      <option value="45deg">Reverse Diagonal</option>
                    </select>
                  </div>
                )}

                {/* Image Controls */}
                <div className="space-y-3">
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className={`w-full py-2.5 text-xs font-bold uppercase tracking-wide rounded-xl border transition-all flex items-center justify-center gap-2 ${bgType === 'image' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}
                  >
                    <ImageIcon className="w-4 h-4" /> {bgImage ? 'Change Image' : 'Upload Image'}
                  </button>

                  {bgType === 'image' && (
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>Brightness</span>
                        <span>{bgBrightness}%</span>
                      </div>
                      <input
                        type="range" min="0" max="200" value={bgBrightness}
                        onChange={(e) => setBgBrightness(e.target.value)}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Typography Section */}
              <div className="space-y-4">
                <label className="section-label">Typography</label>

                {/* Font Selection */}
                {/* Font Selection */}
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => setFont(f)}
                      className={`
                        py-2 px-3 text-xs text-left rounded-lg transition-all border
                        ${font.name === f.name
                          ? 'bg-white border-indigo-500 text-indigo-600 shadow-sm ring-1 ring-indigo-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'}
                      `}
                      style={{ fontFamily: f.name }}
                    >
                      <div className="font-bold">{f.name}</div>
                      <div className="text-[10px] opacity-60 font-sans">{f.label}</div>
                    </button>
                  ))}
                </div>

                {/* Text Color Presets */}
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 font-medium">Text Color</div>
                  <div className="grid grid-cols-5 gap-2">
                    {TEXT_PRESETS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => { setTextColor(color.value); setThemeMode(color.value === '#ffffff' || color.value === '#f1f5f9' || color.value === '#fefce8' ? 'dark' : 'light'); }}
                        className={`w-full aspect-square rounded-lg border shadow-sm transition-all hover:scale-110 ${textColor === color.value ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110' : 'border-slate-200'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                    <div className="relative group w-full aspect-square">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        title="Custom Color"
                      />
                      <div className="w-full h-full rounded-lg border border-dashed border-slate-300 flex items-center justify-center bg-white group-hover:bg-slate-50 transition-colors">
                        <Palette className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Canvas Properties */}
              <div className="space-y-6">
                <label className="section-label">Canvas & Geometry</label>


                {[
                  { label: 'Blur', val: blur, set: setBlur, min: 0, max: 60, unit: 'px' },
                  { label: 'Opacity', val: opacity, set: setOpacity, min: 0, max: 100, unit: '%' },
                  { label: 'Padding', val: padding, set: setPadding, min: 16, max: 128, unit: 'px' },
                  { label: 'Roundness', val: borderRadius, set: setBorderRadius, min: 0, max: 48, unit: 'px' }
                ].map(control => (
                  <div key={control.label} className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>{control.label}</span>
                      <span>{control.val}{control.unit}</span>
                    </div>
                    <input
                      type="range" min={control.min} max={control.max} value={control.val}
                      onChange={(e) => control.set(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Preview Stage --- */}
      <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center p-4 md:p-8 select-none">

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `linear-gradient(#6366f1 1.5px, transparent 1.5px), linear-gradient(90deg, #6366f1 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}></div>

        {/* Rendered Output Container */}
        <div
          ref={previewRef}
          className="relative shadow-2xl transition-all duration-75 ease-out overflow-hidden group flex flex-col items-center justify-center rounded-[36px] p-6 md:p-12"
          style={{
            ...backgroundStyle,
            width: `${canvasSize.width}px`,
            minHeight: `${canvasSize.height}px`,
          }}
        >
          {/* Resize Handle (hidden while exporting/copying so it won't appear in captures) */}
          {!(isExporting || isCopying) && (
            <div
              className="absolute bottom-0 right-0 w-8 h-8 bg-white/25 hover:bg-white/40 backdrop-blur-md cursor-nwse-resize z-50 rounded-tl-xl transition-colors flex items-center justify-center group/handle"
              onMouseDown={handleResizeStart}
              title="Drag to resize canvas"
            >
              <svg
                className="w-3 h-3 opacity-80 group-hover/handle:opacity-100 transition-opacity"
                viewBox="0 0 12 12"
                fill="none"
                stroke="white"
                strokeWidth="1.25"
                strokeLinecap="round"
              >
                <path d="M3 9L9 3" />
                <path d="M5.5 9L9 5.5" />
                <path d="M9 9L9 9" />
              </svg>
            </div>
          )}

          {/* The Glass Card */}
          <div
            className={`
                relative flex flex-col justify-start
                transition-all duration-500 ease-out
                z-10 w-full
              `}
            style={{
              width: '100%',
              flexGrow: 1,
              fontFamily: font.name,
              padding: `${padding}px`,
              borderRadius: `${borderRadius}px`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: themeMode === 'light'
                ? '1px solid rgba(255,255,255,0.6)'
                : '1px solid rgba(255,255,255,0.15)',
              color: textColor,
              minHeight: '100%',
              minWidth: 0,
              overflow: 'hidden',
              justifySelf: 'stretch',
              alignSelf: 'stretch'
            }}
          >
            {/* Blur layer replicated inside card so exports capture the frosted effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                ...glassBlurStyle,
                borderRadius: `${borderRadius}px`,
                transform: 'scale(1.03)',
                transformOrigin: 'center'
              }}
            />

            {/* Tint layer to control glass opacity without relying on backdrop-filter */}
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                backgroundColor: glassTintColor,
                borderRadius: `${borderRadius}px`
              }}
            />

            {/* Mac Window Header */}
            <div className="absolute top-6 left-6 flex items-center gap-2 z-20 opacity-80">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm border border-black/5" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm border border-black/5" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm border border-black/5" />
            </div>

            <div
              className="relative z-10 w-full h-full overflow-hidden custom-markdown"
              style={{ minHeight: 0, minWidth: 0 }}
            >
              <div
                ref={contentRef}
                dangerouslySetInnerHTML={parsedHtmlMemo}
                className="break-words"
              />
            </div>

            {/* Watermark */}
            <div
              className="pointer-events-none absolute bottom-6 right-8 text-[10px] font-bold opacity-40 tracking-[0.25em] uppercase z-10"
              style={{ color: textColor }}
            >
              MarkFrame
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;
