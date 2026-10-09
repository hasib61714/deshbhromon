import { useLang } from '../i18n/LangContext';
import { ShareLinks } from './ShareLinks';
import { challengeUrl } from '../lib/challenge';
import {
  SafeImage
} from './SafeImage';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  DATA
} from '../data/map-data';
import {
  DISTRICT_DETAILS,
  DIVISIONS,
  THEMES,
  getTravelerBadge,
  toBengaliNumber
} from '../data/bangladesh-data';
import {
  getDistrictImage
} from '../data/landmark-images';
import {
  MapTheme
} from '../types';
import {
  readString,
  writeString,
  removeKey
} from '../lib/storage';
import {
  Download,
  Share2,
  CheckCircle2,
  Star,
  Search,
  Palette,
  Camera,
  Trash2,
  CheckCheck,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  Award,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Square,
  RectangleVertical,
  Compass,
  MessageCircle,
  IdCard
} from 'lucide-react';

interface MapTrackerProps {
  visited: Set<string>;
  wishlist: Set<string>;
  onToggleVisited: (district: string) => void;
  onToggleWishlist: (district: string) => void;
  // Districts only travelled through, and special places (Saint Martin's Island)
  passed?: Set<string>;
  onTogglePassed?: (district: string) => void;
  islands?: Set<string>;
  onToggleIsland?: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onOpenCertificate?: () => void;
  onOpenTravelCard?: () => void;
  travelerName: string;
  onTravelerNameChange: (name: string) => void;
}

type AspectRatio = 'standard' | 'square' | 'story';

const NO_DISTRICTS: Set<string> = new Set();
// "Passed through" colour is shared by every theme so it never clashes with visited / wishlist
const PASSED_FILL = '#8b5cf6';
const PASSED_STROKE = '#6d28d9';
// Saint Martin's Island lies about 10 km south of the Teknaf tip, just outside the district map. It is drawn
// as a marker in the bottom-right corner of the map (approximate position, not to scale). It belongs to Cox's Bazar
// district (Teknaf), so it is only an extra mark and never adds to the 64 districts.
const SAINT_MARTIN = { id: 'saint-martin', x: 524, y: 806, bn: 'সেন্ট মার্টিন' };

function loadUserImage(src: string | null): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export const MapTracker: React.FC<MapTrackerProps> = ({
  visited,
  wishlist,
  onToggleVisited,
  onToggleWishlist,
  passed = NO_DISTRICTS,
  onTogglePassed,
  islands = NO_DISTRICTS,
  onToggleIsland,
  onSelectAll,
  onClearAll,
  onOpenCertificate,
  onOpenTravelCard,
  travelerName,
  onTravelerNameChange: setTravelerName,
}) => {
  const { lang, tr, n } = useLang();
  const [activeMode, setActiveMode] = useState<'visited' | 'passed' | 'wishlist'>('visited');
  const [selectedTheme, setSelectedTheme] = useState<MapTheme>(THEMES[0]);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [userPhoto, setUserPhoto] = useState<string | null>(() => readString('user_photo', '') || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
  const [listLayout, setListLayout] = useState<'division' | 'flat'>('division');
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(() => new Set(['Dhaka', 'Chattogram']));
  const [exportAspect, setExportAspect] = useState<AspectRatio>('standard');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Path2D cache
  const pathMap = useMemo(() => {
    const map = new Map<string, Path2D>();
    DATA.f.forEach((feature) => {
      map.set(feature.n, new Path2D(feature.d));
    });
    return map;
  }, []);

  // Handle Photo upload
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Accept only common raster images, then downscale to a small avatar so it is cheap to store
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPhotoError(tr('শুধু JPG, PNG বা WebP ছবি দেওয়া যাবে।'));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError(tr('ছবির আকার ৮ MB এর বেশি হতে পারবে না।'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const side = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setUserPhoto(dataUrl);
        setPhotoError(null);
        // Photo stays visible for this session even if storage is full
        writeString('user_photo', dataUrl);
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setPhotoError(tr('ছবিটি পড়া যায়নি। অন্য একটি ছবি চেষ্টা করুন।'));
    };
    img.src = url;
  };

  const removePhoto = () => {
    setUserPhoto(null);
    removeKey('user_photo');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Toggle Division Accordion
  const toggleDivisionExpand = (divId: string) => {
    setExpandedDivisions((prev) => {
      const next = new Set(prev);
      if (next.has(divId)) {
        next.delete(divId);
      } else {
        next.add(divId);
      }
      return next;
    });
  };

  // Select all districts in a division
  const handleSelectDivision = (divId: string) => {
    const divDistricts = DATA.f.filter((f) => f.dv === divId).map((f) => f.n);
    divDistricts.forEach((d) => {
      if (!visited.has(d)) {
        onToggleVisited(d);
      }
    });
  };

  // Deselect all districts in a division
  const handleClearDivision = (divId: string) => {
    const divDistricts = DATA.f.filter((f) => f.dv === divId).map((f) => f.n);
    divDistricts.forEach((d) => {
      if (visited.has(d)) {
        onToggleVisited(d);
      }
    });
  };

  // Render Canvas
  const drawMapAsync = useCallback(
    async (targetCanvas: HTMLCanvasElement, forExport = false, aspect: AspectRatio = 'standard') => {
      const ctx = targetCanvas.getContext('2d');
      if (!ctx) return;

      const baseWidth = DATA.w; // 600
      const baseHeight = DATA.h; // 828
      const headerHeight = forExport ? 165 : 0;
      const footerHeight = forExport ? 95 : 0;

      const dpr = forExport ? 2 : Math.min(window.devicePixelRatio || 1, 2);

      let totalWidth = baseWidth;
      let totalHeight = baseHeight + headerHeight + footerHeight;

      if (forExport) {
        if (aspect === 'square') {
          totalWidth = 840;
          totalHeight = 840;
        } else if (aspect === 'story') {
          totalWidth = 600;
          totalHeight = 1067;
        }
      }

      if (!forExport) {
        targetCanvas.width = baseWidth * dpr;
        targetCanvas.height = baseHeight * dpr;
        ctx.scale(dpr, dpr);
      } else {
        targetCanvas.width = totalWidth * dpr;
        targetCanvas.height = totalHeight * dpr;
        ctx.scale(dpr, dpr);
      }

      // Background
      ctx.fillStyle = selectedTheme.bg;
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      // Preload user photo if export
      const photoImg = forExport ? await loadUserImage(userPhoto) : null;

      // Render Export Header
      if (forExport) {
        ctx.save();

        const grad = ctx.createLinearGradient(0, 0, totalWidth, headerHeight);
        grad.addColorStop(0, '#042f2e');
        grad.addColorStop(1, '#064e3b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, totalWidth, headerHeight);

        // Watermark & App Brand
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px "Anek Bangla", sans-serif';
        ctx.fillText(lang === 'en' ? 'DeshBhromon' : 'দেশভ্রমণ · DeshBhromon', 28, 44);

        ctx.fillStyle = '#6ee7b7';
        ctx.font = '600 13px "Anek Bangla", sans-serif';
        ctx.fillText(lang === 'en' ? 'Bangladesh travel map & district explorer' : 'বাংলাদেশ ভ্রমণ মানচিত্র ও জেলা এক্সপ্লোরার', 28, 68);

        const badge = getTravelerBadge(visited.size);
        const nameText = travelerName.trim() || (lang === 'en' ? 'My Bangladesh' : 'আমার বাংলাদেশ');

        // Draw Avatar if user photo uploaded
        if (photoImg) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(64, 114, 32, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(photoImg, 32, 82, 64, 64);
          ctx.restore();

          // Golden Avatar Ring
          ctx.save();
          ctx.beginPath();
          ctx.arc(64, 114, 32, 0, Math.PI * 2);
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#f59e0b';
          ctx.stroke();
          ctx.restore();

          // Text next to avatar
          const textX = 112;
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px "Anek Bangla", sans-serif';
          ctx.fillText(`${lang === 'en' ? 'Traveller' : 'যাত্রী'}: ${nameText}`, textX, 106);

          ctx.fillStyle = '#fde68a';
          ctx.font = '600 13px "Anek Bangla", sans-serif';
          ctx.fillText(`${badge.emoji} ${badge.title} (${badge.en})`, textX, 128);
        } else {
          // No user photo: Clean Typography & Traveler Details
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px "Anek Bangla", sans-serif';
          ctx.fillText(`${lang === 'en' ? 'Traveller' : 'যাত্রী'}: ${nameText}`, 28, 110);

          ctx.fillStyle = '#fde68a';
          ctx.font = '600 13px "Anek Bangla", sans-serif';
          ctx.fillText(`${badge.emoji} ${badge.title} (${badge.en})`, 28, 134);
        }

        // Stats Box on the right
        ctx.textAlign = 'right';
        ctx.fillStyle = '#a7f3d0';
        ctx.font = 'bold 36px "Anek Bangla", sans-serif';
        ctx.fillText(lang === 'en' ? `${visited.size} / 64` : `${toBengaliNumber(visited.size)} / ৬৪`, totalWidth - 28, 68);

        ctx.fillStyle = '#d1fae5';
        ctx.font = '600 14px "Anek Bangla", sans-serif';
        const pct = Math.round((visited.size / 64) * 100);
        ctx.fillText(lang === 'en' ? `Explored: ${pct}%` : `মোট অন্বেষণ: ${toBengaliNumber(pct)}%`, totalWidth - 28, 96);

        if (wishlist.size > 0) {
          ctx.fillStyle = '#fef08a';
          ctx.fillText(lang === 'en' ? `Wishlist: ${wishlist.size} districts` : `ইচ্ছেতালিকা: ${toBengaliNumber(wishlist.size)}টি জেলা`, totalWidth - 28, 122);
        }

        if (passed.size > 0) {
          ctx.fillStyle = '#ddd6fe';
          ctx.fillText(lang === 'en' ? `Passed through: ${passed.size} districts` : `পথে পেরিয়েছি: ${toBengaliNumber(passed.size)}টি জেলা`, totalWidth - 28, 146);
        }

        ctx.textAlign = 'left';
        ctx.restore();
      }

      // Shift map down if exporting
      ctx.save();
      if (forExport) {
        const mapOffsetX = (totalWidth - baseWidth) / 2;
        ctx.translate(mapOffsetX, headerHeight);
      }

      // Draw all district polygons
      DATA.f.forEach((feature) => {
        const path = pathMap.get(feature.n);
        if (!path) return;

        const isVisited = visited.has(feature.n);
        const isWishlist = wishlist.has(feature.n);
        const isPassed = passed.has(feature.n) && !isVisited;
        const isHovered = hoveredDistrict === feature.n;

        // Fill color determination
        if (isVisited) {
          ctx.fillStyle = selectedTheme.visitedFill;
        } else if (isPassed) {
          ctx.fillStyle = PASSED_FILL;
        } else if (isWishlist) {
          ctx.fillStyle = selectedTheme.wishlistFill;
        } else {
          ctx.fillStyle = selectedTheme.unvisitedFill;
        }

        // Hover highlight
        if (isHovered && !forExport) {
          ctx.fillStyle = isVisited
            ? '#059669'
            : isPassed
            ? '#a78bfa'
            : isWishlist
            ? '#fbbf24'
            : '#cbd5e1';
        }

        ctx.fill(path);

        // District borders
        ctx.strokeStyle = isVisited
          ? selectedTheme.visitedStroke
          : isPassed
          ? PASSED_STROKE
          : isWishlist
          ? selectedTheme.wishlistStroke
          : selectedTheme.unvisitedStroke;
        ctx.lineWidth = isHovered && !forExport ? 2 : 1;
        ctx.stroke(path);
      });

      // Draw District Labels if enabled
      if (showLabels) {
        ctx.font = '600 9.5px "Anek Bangla", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        DATA.f.forEach((feature) => {
          const [cx, cy] = feature.c;
          const info = DISTRICT_DETAILS[feature.n];
          const label = info ? info.bn : feature.n;
          const isVisited = visited.has(feature.n);
          const isWishlist = wishlist.has(feature.n);
          const isPassed = passed.has(feature.n);

          if (isVisited || isWishlist || isPassed) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.6)';
            ctx.shadowBlur = 3;
          } else {
            ctx.fillStyle = selectedTheme.textDark ? '#334155' : '#e2e8f0';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
          }

          ctx.fillText(label, cx, cy);
        });
      }

      // Saint Martin's Island marker (approximate position, outside the district shapes)
      {
        const done = islands.has(SAINT_MARTIN.id);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        // Dashed link to the Teknaf tip: the island is part of Cox's Bazar district, not a separate district
        ctx.beginPath();
        ctx.moveTo(SAINT_MARTIN.x + 6, SAINT_MARTIN.y + 3);
        ctx.lineTo(551, 822);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#0369a1';
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(SAINT_MARTIN.x, SAINT_MARTIN.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = done ? selectedTheme.visitedFill : '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = done ? selectedTheme.visitedStroke : '#0369a1';
        if (!done) ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = '700 9px "Anek Bangla", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = selectedTheme.textDark ? '#0c4a6e' : '#e2e8f0';
        ctx.fillText(SAINT_MARTIN.bn, SAINT_MARTIN.x - 11, SAINT_MARTIN.y);
      }

      ctx.restore();

      // Render Export Footer
      if (forExport) {
        ctx.save();
        const footerY = totalHeight - footerHeight;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, footerY, totalWidth, footerHeight);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 12px "Anek Bangla", sans-serif';
        ctx.fillText(lang === 'en' ? 'Make your own Bangladesh travel map' : 'আপনার নিজের বাংলাদেশ ভ্রমণ মানচিত্র বানান', 28, footerY + 38);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(lang === 'en' ? 'DeshBhromon' : 'দেশভ্রমণ · DeshBhromon', 28, footerY + 62);

        // Date
        ctx.textAlign = 'right';
        ctx.fillStyle = '#cbd5e1';
        const todayStr = new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'bn-BD', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        ctx.fillText(`${lang === 'en' ? 'Date' : 'তারিখ'}: ${todayStr}`, totalWidth - 28, footerY + 50);

        ctx.restore();
      }
    },
    [
      lang,
      visited,
      wishlist,
      passed,
      islands,
      selectedTheme,
      showLabels,
      travelerName,
      userPhoto,
      hoveredDistrict,
      pathMap,
    ]
  );

  // Redraw preview map when dependencies change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawMapAsync(canvas, false);
    }
  }, [drawMapAsync]);

  // Canvas Mouse Move (Hover effect)
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = DATA.w / rect.width;
    const scaleY = DATA.h / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let found: string | null = null;
    for (const feature of DATA.f) {
      const path = pathMap.get(feature.n);
      if (path && ctx.isPointInPath(path, mouseX, mouseY)) {
        found = feature.n;
        break;
      }
    }

    setHoveredDistrict(found);
  };

  // Canvas Click (Toggle district)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = DATA.w / rect.width;
    const scaleY = DATA.h / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Saint Martin's Island marker
    if (Math.hypot(mouseX - SAINT_MARTIN.x, mouseY - SAINT_MARTIN.y) <= 16 && onToggleIsland) {
      onToggleIsland(SAINT_MARTIN.id);
      return;
    }

    for (const feature of DATA.f) {
      const path = pathMap.get(feature.n);
      if (path && ctx.isPointInPath(path, mouseX, mouseY)) {
        if (activeMode === 'visited') {
          onToggleVisited(feature.n);
        } else if (activeMode === 'passed') {
          onTogglePassed?.(feature.n);
        } else {
          onToggleWishlist(feature.n);
        }
        break;
      }
    }
  };

  // Export as PNG
  const handleExportPNG = async () => {
    setIsExporting(true);
    setShowDownloadMenu(false);
    try {
      const exportCanvas = document.createElement('canvas');
      await drawMapAsync(exportCanvas, true, exportAspect);

      const link = document.createElement('a');
      const safeName = (travelerName.trim() || 'আমার_বাংলাদেশ').replace(/\s+/g, '_');
      link.download = `DeshBhromon-Map-${safeName}-${exportAspect}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Export as JPG
  const handleExportJPG = async () => {
    setIsExporting(true);
    setShowDownloadMenu(false);
    try {
      const exportCanvas = document.createElement('canvas');
      await drawMapAsync(exportCanvas, true, exportAspect);

      const link = document.createElement('a');
      const safeName = (travelerName.trim() || 'আমার_বাংলাদেশ').replace(/\s+/g, '_');
      link.download = `DeshBhromon-Map-${safeName}-${exportAspect}.jpg`;
      link.href = exportCanvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Export as PDF (A4 Document Format)
  const handleExportPDF = async () => {
    setIsExporting(true);
    setShowDownloadMenu(false);
    try {
      const exportCanvas = document.createElement('canvas');
      await drawMapAsync(exportCanvas, true, 'standard');

      const imgData = exportCanvas.toDataURL('image/jpeg', 0.95);
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const aspect = exportCanvas.height / exportCanvas.width;

      const renderWidth = pdfWidth - 24; // 12mm margins
      const renderHeight = renderWidth * aspect;

      // Dark emerald page backdrop
      pdf.setFillColor(4, 47, 46);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      const topOffset = Math.max(10, (pdfHeight - renderHeight) / 2);
      pdf.addImage(imgData, 'JPEG', 12, topOffset, renderWidth, renderHeight);

      const safeName = (travelerName.trim() || 'আমার_বাংলাদেশ').replace(/\s+/g, '_');
      pdf.save(`DeshBhromon-Map-${safeName}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // WhatsApp Share
  const handleShareWhatsApp = () => {
    const name = travelerName.trim() || (lang === 'en' ? 'My Bangladesh' : 'আমার বাংলাদেশ');
    const msg = lang === 'en'
      ? `🗺️ *${name}'s Bangladesh travel map*\n🏆 Achievement: ${badge.emoji} ${badge.en}\n📍 Visited: ${visited.size} / 64 districts (${percentage}%)\n⭐ Wishlist: ${wishlist.size} districts\n\nMake your own personalised travel map on DeshBhromon and download it free:\n${window.location.href}`
      : `🗺️ *${name} এর বাংলাদেশ ভ্রমণ মানচিত্র*
🏆 অর্জন: ${badge.emoji} ${badge.title} (${badge.en})
📍 ভ্রমণ সম্পন্ন: ${toBengaliNumber(visited.size)} / ৬৪টি জেলা (${toBengaliNumber(percentage)}%)
⭐ ইচ্ছেতালিকা: ${toBengaliNumber(wishlist.size)}টি জেলা

দেশভ্রমণ অ্যাপে আপনার নিজস্ব পার্সোনালাইজড ট্রাভেল ম্যাপ তৈরি করুন ও বিনামূল্যে ডাউনলোড করুন:
${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  // Facebook Share
  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer');
  };

  // Filtered districts list for the sidebar
  const filteredDistricts = useMemo(() => {
    return DATA.f.filter((feature) => {
      const info = DISTRICT_DETAILS[feature.n];
      const matchSearch =
        feature.n.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (info && info.bn.includes(searchQuery)) ||
        feature.n.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDivision =
        selectedDivisionFilter === 'all' || feature.dv === selectedDivisionFilter;
      return matchSearch && matchDivision;
    });
  }, [searchQuery, selectedDivisionFilter]);

  const percentage = Math.round((visited.size / 64) * 100);
  const badge = getTravelerBadge(visited.size);

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Hero Traveler Banner */}
      <section className="relative text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden bg-emerald-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/assets/hero/hero-poster.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/90 to-teal-950/80" />
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{tr('ইন্টারঅ্যাক্টিভ ৬৪ জেলা ভ্রমণ মানচিত্র')}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {tr('বাংলাদেশের কতটুকু ঘুরে দেখেছেন?')}
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              {tr('ঘোরা জেলাগুলোতে ক্লিক করে নিজের ভ্রমণ মানচিত্র রঙিন করুন, নিজের নাম ও ছবি যুক্ত করুন, পছন্দের থিম বেছে নিন এবং সোশ্যাল মিডিয়ায় শেয়ারের জন্য PNG, JPG বা PDF ডাউনলোড করুন।')}
            </p>

            {visited.size > 0 && (
              <div data-challenge-share className="pt-3 space-y-1.5">
                <p className="text-xs font-bold text-emerald-100">{tr('বন্ধুকে চ্যালেঞ্জ করুন: সে কতটা ঘুরেছে?')}</p>
                <ShareLinks
                  url={challengeUrl(window.location.origin, visited, travelerName, Object.keys(DISTRICT_DETAILS).sort())}
                  text={lang === 'en' ? `I have visited ${visited.size}/64 districts. How many have you visited?` : `আমি ${toBengaliNumber(visited.size)}/৬৪ জেলা ঘুরেছি। তুমি কতটা ঘুরেছ?`}
                />
              </div>
            )}

            {/* Quick Share buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{tr('হোয়াটসঅ্যাপে শেয়ার')}</span>
              </button>

              <button
                type="button"
                onClick={handleShareFacebook}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{tr('ফেসবুকে শেয়ার')}</span>
              </button>
            </div>
          </div>

          {/* Real-time Explorer Status Score Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl w-full lg:w-80 flex flex-col gap-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                {tr('ভ্রমণ স্কোর কার্ড')}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                {badge.emoji} {lang === 'en' ? badge.en : badge.title}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {n(visited.size)}
              </span>
              <span className="text-sm text-emerald-200 font-semibold">/ {lang === 'en' ? '64 districts' : '৬৪টি জেলা'}</span>
              <span className="ml-auto text-xl font-bold text-amber-300">
                {n(percentage)}%
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-emerald-950/60 rounded-full h-3 overflow-hidden border border-emerald-600/30">
              <div
                className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-emerald-200 pt-1">
              <span>{tr('ইচ্ছেতালিকা:')} <strong className="text-white font-bold">{n(wishlist.size)}</strong> {lang === 'en' ? (wishlist.size === 1 ? 'district' : 'districts') : 'জেলা'}</span>
              {passed.size > 0 && (
                <span>{tr('পথে পেরিয়েছি:')} <strong className="text-white font-bold">{n(passed.size)}</strong> {lang === 'en' ? (passed.size === 1 ? 'district' : 'districts') : 'জেলা'}</span>
              )}
              <span>{tr('বাকি:')} <strong className="text-white font-bold">{n(64 - visited.size)}{lang === 'en' ? '' : 'টি'}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: District Checklist & Division Accordions */}
        <aside className="lg:col-span-4 bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <span>{tr('জেলা বাছাই করুন')}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                  {n(filteredDistricts.length)}
                </span>
              </h2>

              {/* Mode Toggle: Visited vs Wishlist */}
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveMode('visited')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeMode === 'visited'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{tr('ঘুরেছি')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('passed')}
                  aria-pressed={activeMode === 'passed'}
                  title={tr('যাত্রাপথে যে জেলার উপর দিয়ে গিয়েছি (নামিনি)')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeMode === 'passed'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{tr('পথে')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('wishlist')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeMode === 'wishlist'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>{tr('ইচ্ছে')}</span>
                </button>
              </div>
            </div>

            {/* View Mode: By Division vs Flat List */}
            <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-xl border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setListLayout('division')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold transition-all ${
                  listLayout === 'division'
                    ? 'bg-white text-emerald-800 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tr('বিভাগীয় তালিকা')}</span>
              </button>

              <button
                type="button"
                onClick={() => setListLayout('flat')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold transition-all ${
                  listLayout === 'flat'
                    ? 'bg-white text-emerald-800 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tr('সব জেলা (৬৪টি)')}</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={tr('জেলার নাম দিয়ে খুঁজুন (যেমন: কক্সবাজার, সিলেট)...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>

            {/* Division Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedDivisionFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDivisionFilter === 'all'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tr('সব বিভাগ')}
              </button>
              {DIVISIONS.map((div) => {
                const isSelected = selectedDivisionFilter === div.id;
                return (
                  <button
                    key={div.id}
                    type="button"
                    onClick={() => setSelectedDivisionFilter(div.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {lang === 'en' ? div.id : div.bn}
                  </button>
                );
              })}
            </div>

            {/* Global Bulk Actions */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
              <button
                type="button"
                onClick={onSelectAll}
                className="flex items-center gap-1 min-h-10 pr-2 text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{tr('সব বাছাই করুন')}</span>
              </button>
              <button
                type="button"
                onClick={onClearAll}
                className="flex items-center gap-1 min-h-10 pl-2 text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{tr('সব মুছুন')}</span>
              </button>
            </div>
          </div>

          {/* District Listing: Either Division Accordion or Flat List */}
          <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {listLayout === 'division' && selectedDivisionFilter === 'all' && !searchQuery ? (
              // 8 Divisions Accordion Layout
              DIVISIONS.map((div) => {
                const isExpanded = expandedDivisions.has(div.id);
                const divDistricts = DATA.f.filter((f) => f.dv === div.id);
                const divVisitedCount = divDistricts.filter((f) => visited.has(f.n)).length;
                const divPct = Math.round((divVisitedCount / divDistricts.length) * 100);

                return (
                  <div
                    key={div.id}
                    className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50"
                  >
                    {/* Division Header */}
                    <div
                      onClick={() => toggleDivisionExpand(div.id)}
                      className="flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: div.color }}
                        />
                        <strong className="text-xs font-bold text-stone-900">
                          {lang === 'en' ? `${div.id} Division` : `${div.bn} বিভাগ`}
                        </strong>
                        <span className="text-[11px] font-semibold text-stone-500">
                          ({n(divVisitedCount)}/{n(divDistricts.length)})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {n(divPct)}%
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-stone-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-400" />
                        )}
                      </div>
                    </div>

                    {/* Division Body */}
                    {isExpanded && (
                      <div className="p-3 bg-white border-t border-stone-200/80 space-y-2">
                        {/* Division Quick Actions */}
                        <div className="flex items-center justify-between text-[11px] pb-2 border-b border-stone-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectDivision(div.id);
                            }}
                            className="min-h-10 pr-2 text-emerald-700 hover:text-emerald-900 font-bold"
                          >
                            {tr('+ সম্পূর্ণ বিভাগ নির্বাচন')}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearDivision(div.id);
                            }}
                            className="min-h-10 pl-2 text-stone-400 hover:text-rose-600 font-medium"
                          >
                            {tr('রিসেট')}
                          </button>
                        </div>

                        {/* Districts in division */}
                        <div className="space-y-1">
                          {divDistricts.map((feature) => {
                            const info = DISTRICT_DETAILS[feature.n];
                            const isVisited = visited.has(feature.n);
                            const isWishlist = wishlist.has(feature.n);

                            return (
                              <div
                                key={feature.n}
                                onMouseEnter={() => setHoveredDistrict(feature.n)}
                                onMouseLeave={() => setHoveredDistrict(null)}
                                className={`flex items-center justify-between p-1.5 rounded-xl text-xs transition-colors ${
                                  hoveredDistrict === feature.n ? 'bg-emerald-50' : 'hover:bg-stone-50'
                                }`}
                              >
                                <label
                                  className="flex items-center gap-2 cursor-pointer flex-1 min-h-8"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isVisited}
                                    onChange={() => onToggleVisited(feature.n)}
                                    className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                                  />
                                  <span className="font-bold text-stone-800">
                                    {lang === 'en' ? feature.n : info ? info.bn : feature.n}
                                  </span>
                                </label>

                                <button
                                  type="button"
                                  onClick={() => onToggleWishlist(feature.n)}
                                  className={`p-2 rounded-md transition-colors ${
                                    isWishlist
                                      ? 'text-amber-500 bg-amber-50'
                                      : 'text-stone-300 hover:text-amber-500'
                                  }`}
                                  title={tr('ইচ্ছেতালিকা')}
                                  aria-label={lang === 'en' ? `${feature.n} wishlist ${isWishlist ? '(on)' : '(add)'}` : `${info ? info.bn : feature.n} ইচ্ছেতালিকায় ${isWishlist ? "আছে" : "যোগ করুন"}`}
                                  aria-pressed={isWishlist}
                                >
                                  <Star className={`w-3.5 h-3.5 ${isWishlist ? 'fill-amber-500' : ''}`} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Flat Districts Checklist
              filteredDistricts.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  {tr('কোনো জেলা পাওয়া যায়নি')}
                </div>
              ) : (
                filteredDistricts.map((feature) => {
                  const info = DISTRICT_DETAILS[feature.n];
                  const isVisited = visited.has(feature.n);
                  const isWishlist = wishlist.has(feature.n);

                  return (
                    <div
                      key={feature.n}
                      onMouseEnter={() => setHoveredDistrict(feature.n)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                        hoveredDistrict === feature.n ? 'bg-emerald-50/70' : 'hover:bg-stone-50'
                      }`}
                    >
                      <label
                        className="flex items-center gap-2 cursor-pointer flex-1 min-h-8"
                      >
                        <input
                          type="checkbox"
                          checked={isVisited}
                          onChange={() => onToggleVisited(feature.n)}
                          className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                        />
                        <div>
                          <span className="font-bold text-stone-800">
                            {lang === 'en' ? feature.n : info ? info.bn : feature.n}
                          </span>
                          <span className="text-[11px] text-stone-400 ml-1.5">
                            ({info ? info.dvBn : feature.dv})
                          </span>
                        </div>
                      </label>

                      <button
                        type="button"
                        onClick={() => onTogglePassed?.(feature.n)}
                        aria-label={lang === 'en' ? `${feature.n} passed through ${passed.has(feature.n) ? '(on)' : '(add)'}` : `${info ? info.bn : feature.n} যাত্রাপথে পেরিয়েছি ${passed.has(feature.n) ? '(আছে)' : 'যোগ করুন'}`}
                        aria-pressed={passed.has(feature.n)}
                        title={passed.has(feature.n) ? tr('পথে-পেরোনো থেকে সরান') : tr('যাত্রাপথে পেরিয়েছি')}
                        className={`p-2 rounded-md transition-colors ${
                          passed.has(feature.n)
                            ? 'text-violet-600 bg-violet-50'
                            : 'text-stone-300 hover:text-violet-600'
                        }`}
                      >
                        <Compass className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleWishlist(feature.n)}
                        aria-label={lang === 'en' ? `${feature.n} wishlist ${isWishlist ? '(on)' : '(add)'}` : `${info ? info.bn : feature.n} ইচ্ছেতালিকায় ${isWishlist ? 'আছে' : 'যোগ করুন'}`}
                        aria-pressed={isWishlist}
                        title={isWishlist ? tr('ইচ্ছেতালিকা থেকে সরান') : tr('ইচ্ছেতালিকায় যোগ করুন')}
                        className={`p-2 rounded-md transition-colors ${
                          isWishlist
                            ? 'text-amber-500 bg-amber-50'
                            : 'text-stone-300 hover:text-amber-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isWishlist ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  );
                })
              )
            )}
          </div>
        </aside>

        {/* Right Side: Map Canvas, Personalization Bar & Toolbar */}
        <section className="lg:col-span-8 bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
          {/* Personalization & Theme Controls */}
          <div className="space-y-4 pb-4 border-b border-stone-100">
            {/* User Photo & Name Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-white border border-emerald-200/70">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Photo Upload / Avatar */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {userPhoto ? (
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <img
                        src={userPhoto}
                        alt={tr('আপনার ছবি')}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto();
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs"
                        title={tr('ছবি মুছুন')}
                        aria-label={tr('ছবি মুছুন')}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 rounded-full bg-emerald-100/80 hover:bg-emerald-200 text-emerald-800 border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center transition-all cursor-pointer"
                      title={tr('নিজের ছবি যুক্ত করুন (Optional)')}
                    >
                      <Camera className="w-4 h-4" />
                      <span className="text-[8px] font-bold">{tr('+ছবি')}</span>
                    </button>
                  )}
                </div>

                {/* Name Input */}
                <div className="space-y-1 flex-1 sm:w-64">
                  <label className="text-[11px] font-bold text-stone-700 block">
                    {tr('মানচিত্রে আপনার নাম:')}
                  </label>
                  {photoError && (
                    <p role="alert" className="text-[11px] text-rose-700 font-semibold">
                      {photoError}
                    </p>
                  )}
                  <input
                    type="text"
                    placeholder={tr('আমার বাংলাদেশ / আপনার নাম...')}
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    maxLength={32}
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
              </div>

              {/* Aspect Ratio Selector for Social Media (Post / Story) */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setExportAspect('standard')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    exportAspect === 'standard'
                      ? 'bg-white text-emerald-800 shadow-xs border border-stone-200'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title={tr('স্ট্যান্ডার্ড ৪:৫ ফরম্যাট')}
                >
                  <RectangleVertical className="w-3.5 h-3.5" />
                  <span>{tr('স্ট্যান্ডার্ড')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportAspect('square')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    exportAspect === 'square'
                      ? 'bg-white text-emerald-800 shadow-xs border border-stone-200'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title={tr('স্কয়ার ১:১ ইনস্টাগ্রাম ও ফেসবুক পোস্ট')}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>{tr('১:১ পোস্ট')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportAspect('story')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    exportAspect === 'story'
                      ? 'bg-white text-emerald-800 shadow-xs border border-stone-200'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title={tr('স্টোরি ৯:১৬ ইনস্টাগ্রাম ও ফেসবুক স্টোরি')}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{tr('৯:১৬ স্টোরি')}</span>
                </button>
              </div>
            </div>

            {/* Themes and Labels row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0 max-w-full">
                <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-stone-400" />
                  <span>{tr('৫টি অনন্য থিম:')}</span>
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto min-w-0">
                  {THEMES.map((theme) => {
                    const isSelected = selectedTheme.id === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-emerald-600 bg-stone-100 font-bold'
                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-stone-300"
                          style={{ backgroundColor: theme.visitedFill }}
                        />
                        <span>{theme.nameBn.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Show Labels Toggle */}
              <button
                type="button"
                onClick={() => setShowLabels(!showLabels)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-colors border border-stone-200 cursor-pointer ${
                  showLabels
                    ? 'bg-stone-100 text-stone-800'
                    : 'bg-white text-stone-400 hover:text-stone-600'
                }`}
              >
                {showLabels ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showLabels ? tr('জেলার নাম অন') : tr('জেলার নাম অফ')}</span>
              </button>
            </div>
          </div>

          {/* Colour legend */}
          <div data-map-legend className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-stone-600">
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: selectedTheme.visitedFill }} />{tr('ঘুরেছি')}</span>
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: PASSED_FILL }} />{tr('যাত্রাপথে পেরিয়েছি')}</span>
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: selectedTheme.wishlistFill }} />{tr('ইচ্ছে')}</span>
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-sky-700" />সেন্ট মার্টিন দ্বীপ (কক্সবাজার জেলার অংশ, ৬৪-র মধ্যেই; ক্লিক করে চিহ্নিত করুন)</span>
          </div>

          {/* Interactive Canvas Container */}

          <div className="relative w-full aspect-[600/828] max-w-[620px] mx-auto bg-stone-50 rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex items-center justify-center">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredDistrict(null)}
              onClick={handleCanvasClick}
              className="w-full h-full cursor-pointer touch-none"
              style={{ maxHeight: '720px' }}
            />

            {/* Hover Tooltip Overlay with Authentic Landmark Photo */}
            {hoveredDistrict && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-stone-950/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/20 pointer-events-none transition-all overflow-hidden animate-in fade-in zoom-in-95">
                <div className="relative h-28 w-full overflow-hidden bg-stone-900">
                  <SafeImage
                    src={getDistrictImage(hoveredDistrict).url}
                    alt={lang === 'en' ? hoveredDistrict : DISTRICT_DETAILS[hoveredDistrict]?.bn || hoveredDistrict}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="font-extrabold text-base text-white block drop-shadow-md">
                        {lang === 'en' ? hoveredDistrict : DISTRICT_DETAILS[hoveredDistrict]?.bn || hoveredDistrict}
                      </span>
                      <span className="text-[10px] text-emerald-300 font-semibold">
                        {lang === 'en' ? `${DISTRICT_DETAILS[hoveredDistrict]?.dv} Division` : `${DISTRICT_DETAILS[hoveredDistrict]?.dvBn} বিভাগ`}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        visited.has(hoveredDistrict)
                          ? 'bg-emerald-600 text-white'
                          : passed.has(hoveredDistrict)
                          ? 'bg-violet-600 text-white'
                          : wishlist.has(hoveredDistrict)
                          ? 'bg-amber-500 text-white'
                          : 'bg-stone-800/80 text-stone-300'
                      }`}
                    >
                      {visited.has(hoveredDistrict)
                        ? tr('✓ ঘুরেছেন')
                        : passed.has(hoveredDistrict)
                        ? tr('🧭 পথে পেরিয়েছেন')
                        : wishlist.has(hoveredDistrict)
                        ? tr('⭐ ইচ্ছে')
                        : tr('ঘুরতে বাকি')}
                    </span>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                    {DISTRICT_DETAILS[hoveredDistrict]?.fam}
                  </p>
                  <span className="text-[10px] text-stone-400 block italic pt-0.5">
                    📸 {getDistrictImage(hoveredDistrict).caption}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Download & Export Action Bar (PNG, JPG, PDF) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-stone-50 to-emerald-50/40 border border-stone-200">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {lang === 'en' ? <>The map will be saved with <strong>{travelerName.trim() || 'My Bangladesh'}</strong> and the <strong>{badge.en}</strong> badge.</> : <>ম্যাপে <strong>{travelerName.trim() || 'আমার বাংলাদেশ'}</strong> এবং <strong>{badge.title}</strong> ব্যাজসহ সংরক্ষিত হবে।</>}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {onOpenTravelCard && (
                <button
                  type="button"
                  onClick={onOpenTravelCard}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white font-extrabold rounded-xl text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <IdCard className="w-4 h-4" aria-hidden="true" />
                  <span>{tr('ট্রাভেল কার্ড (Facebook)')}</span>
                </button>
              )}
              {onOpenCertificate && (
                <button
                  type="button"
                  onClick={onOpenCertificate}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-extrabold rounded-xl text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-stone-900" />
                  <span>{tr('সনদপত্র / সার্টিফিকেট')}</span>
                </button>
              )}

              {/* PNG Download */}
              <button
                type="button"
                disabled={isExporting}
                onClick={handleExportPNG}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
                title={tr('উচ্চ রেজোলিউশন পিএনজি')}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{tr('PNG ম্যাপ')}</span>
              </button>

              {/* JPG Download */}
              <button
                type="button"
                disabled={isExporting}
                onClick={handleExportJPG}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer"
                title={tr('জেপিজি ছবি')}
              >
                <span>JPG</span>
              </button>

              {/* PDF Download */}
              <button
                type="button"
                disabled={isExporting}
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer"
                title={tr('প্রিন্টেবল এ৪ পিডিএফ ডকুমেন্ট')}
              >
                <FileText className="w-3.5 h-3.5 text-rose-600" />
                <span>{tr('PDF ডকুমেন্ট')}</span>
              </button>

              {/* Native Mobile Share */}
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: tr('আমার বাংলাদেশ ভ্রমণ মানচিত্র'),
                      text: lang === 'en' ? `I have visited ${visited.size} of Bangladesh's 64 districts! Make your map on DeshBhromon:` : `আমি বাংলাদেশের ৬৪ জেলার মধ্যে ${toBengaliNumber(visited.size)}টি জেলা ভ্রমণ করেছি! দেশভ্রমণ অ্যাপে আপনার ম্যাপ তৈরি করুন:`,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert(tr('ম্যাপ লিংক ক্লিপবোর্ডে কপি করা হয়েছে!'));
                  }
                }}
                className="p-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl transition-colors cursor-pointer"
                title={tr('শেয়ার করুন')}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
