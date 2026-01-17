import React from 'react';
import { 
  MessageCircle, 
  Briefcase, 
  DollarSign, 
  Brain, 
  Heart, 
  Sparkles,
  Search,
  Mail,
  Zap,
  RefreshCw,
  XCircle,
  Lightbulb,
  Shield,
  MessageSquare,
  Calendar,
  FileText,
  TrendingUp,
  CreditCard,
  Target,
  BookOpen,
  Activity,
  Utensils,
  Moon,
  CheckCircle,
  PiggyBank,
  Users,
  Copy,
  ArrowRight,
  HandHeart,
  ClipboardList,
  Star,
  Edit,
  HelpCircle,
  Sun,
  BarChart,
  PenTool,
  Mic,
  Phone,
  GraduationCap,
  Baby,
  Globe,
  Scan,
  Handshake,
  Smartphone,
  Twitter,
  Camera,
  User
} from 'lucide-react';

// ============================================================================
// OUTPUT ICON COMPONENT - For output type indicators
// ============================================================================

export const OutputIcon = ({ type, color }: { type: string; color: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'insight': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2 2"/></svg>,
    'emotion': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    'target': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    'lightbulb': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1H9a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/></svg>,
    'mail': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>,
    'key': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
    'check': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    'alert': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    'refresh': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
    'strength': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    'eye': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    'default': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="4"/></svg>,
  };
  return icons[type] || icons['default'];
};

// ============================================================================
// OPS ICON COMPONENT - For category and action icons
// ============================================================================

export const OpsIcon = ({ type, color, size = 20 }: { type: string; color: string; size?: number }) => {
  const iconProps = { size, color, strokeWidth: 1.5 };
  
  // Map icon identifiers to Lucide components
  const iconMap: Record<string, React.ReactNode> = {
    // Category Icons (Main 6 categories)
    'message-circle': <MessageCircle {...iconProps} />,
    'clipboard-list': <ClipboardList {...iconProps} />,
    'dollar-sign': <DollarSign {...iconProps} />,
    'brain': <Brain {...iconProps} />,
    'heart': <Heart {...iconProps} />,
    'sparkles': <Sparkles {...iconProps} />,
    
    // Activity Icons
    'search': <Search {...iconProps} />,
    'mail': <Mail {...iconProps} />,
    'zap': <Zap {...iconProps} />,
    'refresh-cw': <RefreshCw {...iconProps} />,
    'x-circle': <XCircle {...iconProps} />,
    'lightbulb': <Lightbulb {...iconProps} />,
    'shield': <Shield {...iconProps} />,
    'message-square': <MessageSquare {...iconProps} />,
    'hand-heart': <HandHeart {...iconProps} />,
    'calendar': <Calendar {...iconProps} />,
    'file-text': <FileText {...iconProps} />,
    'trending-up': <TrendingUp {...iconProps} />,
    'credit-card': <CreditCard {...iconProps} />,
    'target': <Target {...iconProps} />,
    'book-open': <BookOpen {...iconProps} />,
    'activity': <Activity {...iconProps} />,
    'utensils': <Utensils {...iconProps} />,
    'moon': <Moon {...iconProps} />,
    'check-circle': <CheckCircle {...iconProps} />,
    'piggy-bank': <PiggyBank {...iconProps} />,
    'users': <Users {...iconProps} />,
    'star': <Star {...iconProps} />,
    'briefcase': <Briefcase {...iconProps} />,
    'edit': <Edit {...iconProps} />,
    'help-circle': <HelpCircle {...iconProps} />,
    'sun': <Sun {...iconProps} />,
    'bar-chart': <BarChart {...iconProps} />,
    'pen-tool': <PenTool {...iconProps} />,
    'mic': <Mic {...iconProps} />,
    'phone': <Phone {...iconProps} />,
    'graduation-cap': <GraduationCap {...iconProps} />,
    'baby': <Baby {...iconProps} />,
    'globe': <Globe {...iconProps} />,
    'scan': <Scan {...iconProps} />,
    'handshake': <Handshake {...iconProps} />,
    'smartphone': <Smartphone {...iconProps} />,
    'twitter': <Twitter {...iconProps} />,
    'camera': <Camera {...iconProps} />,
    'user': <User {...iconProps} />,
    
    // Utility Icons
    'copy': <Copy size={18} color={color} strokeWidth={1.5} />,
    'arrow-right': <ArrowRight size={16} color={color} strokeWidth={2} />,
    'arrow-left': <ArrowRight size={16} color={color} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />,
    'check': <CheckCircle {...iconProps} />,
    
    // AI Provider Icons (keep as custom SVGs for brand consistency)
    'ai-claude': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l2.5 1.5" /><circle cx="12" cy="12" r="2" fill={color} opacity="0.3" /></svg>,
    'ai-gpt4': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 9h6M9 12h6M9 15h4" /></svg>,
    'ai-grok': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
    
    // Generation Mode Icons (keep as custom SVGs for uniqueness)
    'mode-single': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" fill={color} opacity="0.3" /></svg>,
    'mode-specialist': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill={color} /></svg>,
    'mode-consensus': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="12" r="4" /><circle cx="17" cy="12" r="4" /><circle cx="12" cy="12" r="4" opacity="0.5" /><path d="M10 12h4" strokeWidth="2" /></svg>,
    'mode-chain': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="5" cy="12" r="3" /><circle cx="12" cy="12" r="3" /><circle cx="19" cy="12" r="3" /><path d="M8 12h1M15 12h1" /></svg>,
    'mode-compare': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="5" width="7" height="14" rx="1" /><rect x="14" y="5" width="7" height="14" rx="1" /><path d="M12 8v8M10 10l2-2 2 2M10 14l2 2 2-2" /></svg>,
  };
  
  // Return the mapped icon or fallback to Sparkles
  return iconMap[type] || <Sparkles {...iconProps} />;
};
