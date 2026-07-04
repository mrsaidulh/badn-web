import { WHY_CHOOSE_US_POINTS } from '../data';
import { ShieldCheck, Award, Heart, Sparkles, UserCheck, Star } from 'lucide-react';

export default function WhyChooseUs() {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <UserCheck className="w-6 h-6 text-brand" />;
      case 1:
        return <Heart className="w-6 h-6 text-amber-600" />;
      case 2:
        return <Sparkles className="w-6 h-6 text-brand" />;
      case 3:
        return <ShieldCheck className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-brand" />;
    }
  };

  return (
    <section className="py-20 bg-brand-light/30 border-y border-[#cbdccb]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-extrabold text-brand bg-[#e2eee2] px-3 py-1 rounded-full">
            কেন আমাদের সিলেক্ট করবেন?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            প্রশিক্ষণ আর পুষ্টিবিদদের পরামর্শ <span className="text-brand">একই প্ল্যাটফর্মে!</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            BADN কেন আপনার স্বাস্থ্যকর জীবনের যাত্রায় সেরা সঙ্গী হতে পারে!
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_US_POINTS.map((point, idx) => (
            <div
              key={point.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#cbdccb]/50 transition-all duration-300 flex flex-col justify-between space-y-4 text-left"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-light/60 flex items-center justify-center shadow-inner">
                  {getIcon(idx)}
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  {point.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                  {point.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-brand font-bold pt-3 border-t border-gray-50 uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Uncompromising Quality</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
