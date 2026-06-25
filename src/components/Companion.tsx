import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/audio';
import { shopItems, encouragements } from '../data/janeEyreData';

interface CompanionProps {
  stars: number;
  setStars: React.Dispatch<React.SetStateAction<number>>;
  onAddLog: (log: string) => void;
}

export default function Companion({ stars, setStars, onAddLog }: CompanionProps) {
  const [mood, setMood] = useState<'happy' | 'reading' | 'hungry' | 'super'>('reading');
  const [speech, setSpeech] = useState<string>(
    "哈罗！我是你的阅读萌伴阿福 🐿️！今天我们一起来精读《简爱》第一到三章吧！多做思考题和做小任务可以得到闪亮的星星糖哦！"
  );
  const [chewing, setChewing] = useState(false);
  const [fufuScale, setFufuScale] = useState(1);
  const [fufuLevel, setFufuLevel] = useState(1);
  const [fufuExp, setFufuExp] = useState(0);

  // Random speech every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (mood === 'reading') {
        const idx = Math.floor(Math.random() * encouragements.length);
        setSpeech(encouragements[idx]);
      }
    }, 25000);
    return () => clearInterval(interval);
  }, [mood]);

  const handleTapFufu = () => {
    playSound('click');
    const idx = Math.floor(Math.random() * encouragements.length);
    setSpeech(encouragements[idx]);
    setMood('happy');
    setTimeout(() => setMood('reading'), 3000);
  };

  const handleFeed = (itemId: string, price: number, name: string, emoji: string) => {
    if (stars < price) {
      playSound('error');
      setSpeech(`哎呀，星星不够了呢！还需要 ${price - stars} 颗星星才能买【${name}】哦。快去回答思考题或者写读后感赚星星吧！🌟`);
      return;
    }

    playSound('feed');
    setStars(prev => prev - price);
    setChewing(true);
    setMood('happy');
    
    // Growth points
    const expGain = price === 10 ? 15 : 50;
    const newExp = fufuExp + expGain;
    
    let leveledUp = false;
    let nextLevel = fufuLevel;
    let finalExp = newExp;
    
    // Level up condition: 100 points
    if (newExp >= 100) {
      leveledUp = true;
      nextLevel += 1;
      finalExp = newExp - 100;
    }

    setSpeech(`嚼嚼嚼…… 嗷呜！太美味啦！阿福吃到了【${emoji} ${name}】，变得充满活力！谢谢你！阿福获得 ${expGain} 点成长值！🌈`);
    onAddLog(`喂食阿福：购买并投喂了 ${emoji} ${name}，消耗 ${price} 颗星星`);

    setTimeout(() => {
      setChewing(false);
      if (leveledUp) {
        playSound('levelup');
        setFufuLevel(nextLevel);
        setFufuExp(finalExp);
        setSpeech(`✨ 叮咚！阿福升级啦！当前等级：Lv.${nextLevel}！阿福现在变得更聪明，能吃更多的松果啦！ 🎉`);
        setMood('super');
        setFufuScale(prev => prev + 0.05); // Grows larger
        onAddLog(`阿福等级提升：阿福升到了第 ${nextLevel} 级！`);
        setTimeout(() => setMood('reading'), 5000);
      } else {
        setFufuExp(finalExp);
        setTimeout(() => setMood('reading'), 3000);
      }
    }, 2000);
  };

  const getFufuAppearance = () => {
    if (chewing) return "😋";
    switch (mood) {
      case 'happy': return "😆";
      case 'super': return "😎";
      case 'hungry': return "🥺";
      case 'reading': default: return "🐿️";
    }
  };

  return (
    <div className="bg-[#fffdf9] border-4 border-amber-200 rounded-3xl p-5 shadow-sm relative overflow-hidden" id="fufu-companion">
      {/* Decorative background sun rays */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-50 rounded-full blur-xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center gap-5 relative z-10">
        
        {/* Left: The Pet Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative cursor-pointer" onClick={handleTapFufu} id="fufu-character-tap">
            {/* Pulsing ring around Fufu when level up or happy */}
            <AnimatePresence>
              {(mood === 'happy' || mood === 'super') && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-amber-400 rounded-full"
                />
              )}
            </AnimatePresence>

            <motion.div
              style={{ scale: fufuScale }}
              animate={chewing ? {
                scale: [fufuScale, fufuScale * 1.1, fufuScale, fufuScale * 1.1, fufuScale],
                y: [0, -5, 0, -5, 0]
              } : mood === 'happy' ? {
                y: [0, -12, 0, -12, 0],
                rotate: [0, 10, -10, 10, 0]
              } : mood === 'super' ? {
                scale: [fufuScale, fufuScale * 1.15, fufuScale],
                rotate: [0, 360, 0]
              } : {}}
              transition={chewing ? { duration: 1.5 } : mood === 'happy' ? { duration: 1 } : mood === 'super' ? { duration: 1 } : {}}
              className="w-24 h-24 bg-amber-100 rounded-full border-4 border-amber-300 flex items-center justify-center text-5xl shadow-inner relative select-none"
            >
              {getFufuAppearance()}
              
              {/* Pet level badge */}
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white font-bold text-xs px-2 py-0.5 rounded-full border border-white shadow-sm">
                Lv.{fufuLevel}
              </div>
            </motion.div>
          </div>
          
          <div className="mt-3 w-32">
            <div className="flex justify-between text-xs text-amber-700 font-medium mb-1">
              <span>成长值</span>
              <span>{fufuExp}/100</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                animate={{ width: `${fufuExp}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Center: Speech Bubble */}
        <div className="flex-1">
          <div className="relative bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-[#5c4a37]">
            {/* Triangle indicator pointing left on large screens, up on small */}
            <div className="absolute left-1/2 -top-3 md:-left-3 md:top-1/2 md:-translate-y-1/2 w-0 h-0 border-8 border-transparent border-b-amber-50 border-r-transparent md:border-b-transparent md:border-r-amber-50 z-20 pointer-events-none" />
            <div className="absolute left-1/2 -top-4 md:-left-4 md:top-1/2 md:-translate-y-1/2 w-0 h-0 border-8 border-transparent border-b-amber-200 border-r-transparent md:border-b-transparent md:border-r-amber-200 z-10 pointer-events-none" />
            
            <div className="text-sm leading-relaxed font-medium">
              <span className="font-bold text-amber-800">阿福：</span>
              {speech}
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600/80">
              <Sparkles size={12} className="animate-spin" />
              <span>点击阿福可以听它说话哦！做任务奖励的星星能在这里换成零食投喂它！</span>
            </div>
          </div>
        </div>

        {/* Right: Star Food Shop */}
        <div className="w-full md:w-56 bg-white border-2 border-amber-100 rounded-2xl p-3 flex flex-col justify-between self-stretch" id="fufu-shop">
          <div className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1 border-b border-amber-100 pb-1.5">
            <span>🎁 阿福的星光零食小铺</span>
          </div>

          <div className="flex flex-row md:flex-col gap-2">
            {shopItems.filter(item => item.type === 'food').map(item => (
              <button
                key={item.id}
                id={`buy-${item.id}`}
                onClick={() => handleFeed(item.id, item.price, item.name, item.emoji)}
                className="flex-1 flex items-center justify-between gap-1 p-2 border border-amber-100 rounded-xl hover:bg-amber-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl group-hover:scale-125 transition-transform">{item.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-amber-900">{item.name}</div>
                    <div className="text-[10px] text-gray-400 font-medium">成长+{item.id === 'nut_candy' ? '15' : '50'}</div>
                  </div>
                </div>
                <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-0.5">
                  <span>★</span>
                  <span>{item.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
