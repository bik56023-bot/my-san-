import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ThumbsDown, Star, Sparkles, HelpCircle } from 'lucide-react';
import { characters, Character } from '../data/janeEyreData';
import { playSound } from '../utils/audio';

interface CharacterCardsProps {
  stars: number;
  setStars: React.Dispatch<React.SetStateAction<number>>;
  onAddLog: (log: string) => void;
}

export default function CharacterCards({ stars, setStars, onAddLog }: CharacterCardsProps) {
  // Store flipped card states (character id -> boolean)
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  // Store votes (character id -> 'like' | 'dislike')
  const [votes, setVotes] = useState<Record<string, 'like' | 'dislike'>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const toggleFlip = (id: string) => {
    playSound('click');
    setFlipped(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleVote = (id: string, name: string, type: 'like' | 'dislike', e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card flip
    
    if (votes[id]) {
      playSound('click');
      // Just toggle or update the vote without new stars
      setVotes(prev => ({
        ...prev,
        [id]: type
      }));
      return;
    }

    // Award +2 Stars for first-time evaluation
    playSound('success');
    setVotes(prev => ({
      ...prev,
      [id]: type
    }));
    setStars(prev => prev + 2);
    
    const reactionText = type === 'like' ? "投出了【❤️ 喜欢】" : "投出了【😠 讨厌/害怕】";
    setSuccessMsg(`🎉 棒极了！你对《简爱》的人物【${name}】进行了评价，获得了 +2 颗星星糖！✨`);
    onAddLog(`人物评价：对 ${name} ${reactionText}，获得 2 颗星`);
    
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  // Helper to see if character is a "good/friendly" character or "mean/strict" character
  const isFriendly = (id: string) => {
    return ["jane", "bessie", "mr_lloyd", "rochester", "helen", "miss_temple"].includes(id);
  };

  return (
    <div className="space-y-6" id="character-gallery">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="text-3xl">🎭</div>
        <div>
          <h3 className="font-bold text-amber-900 text-sm md:text-base">三年级人物卡牌大发现</h3>
          <p className="text-xs text-amber-800/80 leading-relaxed mt-0.5">
            《简爱》里有各种各样有趣的人哦！点击卡牌就能<b>翻转</b>看他们对你说悄悄话。告诉阿福你喜不喜欢他们，第一次评价每个角色都可以获得 <b>2 颗星星</b> 奖励！
          </p>
        </div>
      </div>

      {/* Floating Success Notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of character cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {characters.map((char) => {
          const isFlipped = flipped[char.id] || false;
          const userVote = votes[char.id];
          const friendly = isFriendly(char.id);

          return (
            <div 
              key={char.id} 
              id={`char-card-${char.id}`}
              className="h-[310px] perspective cursor-pointer group"
              onClick={() => toggleFlip(char.id)}
            >
              <div className={`relative w-full h-full duration-500 transform-style preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* CARD FRONT */}
                <div className="absolute inset-0 backface-hidden bg-white border-3 border-amber-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between">
                  <div>
                    {/* Top Header */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full">
                        {char.relation}
                      </span>
                      <HelpCircle size={14} className="text-gray-300 group-hover:text-amber-400 transition-colors" />
                    </div>

                    {/* Avatar Emoji */}
                    <div className="flex justify-center mb-3">
                      <div className={`w-16 h-16 rounded-full border-2 ${char.avatarColor} flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 duration-200`}>
                        {char.avatarEmoji}
                      </div>
                    </div>

                    {/* Name & Title */}
                    <div className="text-center">
                      <h4 className="font-bold text-gray-800 text-base">{char.name}</h4>
                      <p className="text-[11px] text-amber-600 font-medium mt-0.5">{char.title}</p>
                    </div>

                    {/* Traits tags */}
                    <div className="flex flex-wrap gap-1 justify-center mt-3.5">
                      {char.traits.map((trait, i) => (
                        <span 
                          key={i} 
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                            friendly 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Voting Panel */}
                  <div className="border-t border-dashed border-gray-100 pt-3 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold">小朋友，你觉得：</span>
                    <div className="flex gap-1.5">
                      {friendly ? (
                        <>
                          <button
                            id={`vote-like-${char.id}`}
                            onClick={(e) => handleVote(char.id, char.name, 'like', e)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                              userVote === 'like'
                                ? 'bg-rose-500 text-white shadow-sm'
                                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                            }`}
                          >
                            <Heart size={10} fill={userVote === 'like' ? 'white' : 'transparent'} />
                            <span>喜欢</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            id={`vote-dislike-${char.id}`}
                            onClick={(e) => handleVote(char.id, char.name, 'dislike', e)}
                            className={`px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                              userVote === 'dislike'
                                ? 'bg-slate-700 text-white shadow-sm'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                            }`}
                          >
                            <ThumbsDown size={10} />
                            <span>坏人/怕</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARD BACK */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fffdfa] border-3 border-amber-300 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-dashed border-amber-100 pb-2">
                      <span className="font-bold text-amber-800 text-xs flex items-center gap-1">
                        <span>📖 人物小传</span>
                      </span>
                      <span className="text-[10px] text-gray-400 bg-amber-50 px-2 py-0.5 rounded-full">点击翻回</span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {char.description}
                    </p>
                  </div>

                  {/* Character Encouragement Quote */}
                  <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 text-center">
                    <p className="text-xs italic text-amber-800 font-bold leading-relaxed">
                      {char.encouragement}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
