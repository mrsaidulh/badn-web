import { FEATURES } from '../data';
import { GraduationCap, BookOpen, Activity, ArrowRight } from 'lucide-react';

export default function FeatureGrid() {
  const getIcon = (name: string, className = "text-[#143a1b]") => {
    switch (name) {
      case 'GraduationCap':
        return <GraduationCap className={`w-8 h-8 ${className}`} />;
      case 'BookOpen':
        return <BookOpen className={`w-8 h-8 ${className}`} />;
      case 'Activity':
        return <Activity className={`w-8 h-8 ${className}`} />;
      default:
        return <GraduationCap className={`w-8 h-8 ${className}`} />;
    }
  };

  return (
    <section className="py-12 bg-white relative z-10 -mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.id}
              className="bg-[#dbe6ca] hover:bg-[#cfdbbd] text-[#143a1b] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group cursor-pointer border border-[#143a1b]/10"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#143a1b]/10 flex items-center justify-center mb-5 group-hover:bg-[#143a1b]/15 transition-all">
                  {getIcon(feat.iconName, "text-[#143a1b]")}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight text-[#e17100] select-none">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#143a1b] leading-relaxed font-semibold">
                  {feat.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 mt-6 text-xs font-extrabold text-[#143a1b] group-hover:text-[#e17100] transition-colors pt-4 border-t border-[#143a1b]/15">
                <span>বিস্তারিত দেখুন</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
