import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';
import { chapters, Vocabulary } from '../data/janeEyreData';
import { playSound } from '../utils/audio';

interface VocabularyTreasureProps {
  stars: number;
  setStars: React.Dispatch<React.SetStateAction<number>>;
  activeChapterId: number;
  collectedWords: string[];
  setCollectedWords: React.Dispatch<React.SetStateAction<string[]>>;
  onAddLog: (log: string) => void;
}

export default function VocabularyTreasure({
  stars,
  setStars,
  activeChapterId,
  collectedWords,
  setCollectedWords,
  onAddLog
}: VocabularyTreasureProps) {
  const currentChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];
  const vocabList = currentChapter.vocabulary;

  // Track currently active card id for detailed explanation
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  // Track read-aloud click animation states
  const [readingId, setReadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    playSound('click');
    setActiveCardId(activeCardId === id ? null : id);
  };

  const handleReadAloud = (vocab: Vocabulary, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid card toggle
    playSound('feed');
    setReadingId(vocab.id);
    
    // Simulate reading-aloud audio feedback
    setTimeout(() => {
      setReadingId(null);
      playSound('success');
      setSuccessMsg(`🗣️ 听到你大声朗读啦！“${vocab.phrase}” 读得真有感情！送你 +1 颗星星糖！✨`);
      setStars(prev => prev + 1);
      onAddLog(`大声朗读：读了“${vocab.phrase}”，获得 1 颗星`);
      
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 1200);
  };

  const handleCollect = (vocab: Vocabulary, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid card toggle
    if (collectedWords.includes(vocab.id)) {
      playSound('click');
      return;
    }

    playSound('success');
    setCollectedWords(prev => [...prev, vocab.id]);
    setStars(prev => prev + 2);
    setSuccessMsg(`📚 成功收藏！已将“${vocab.phrase}”放入你的摘抄本中！获得 +2 颗星星糖！🌟`);
    onAddLog(`好词收藏：将“${vocab.phrase}”存入摘抄本，获得 2 颗星`);

    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  return (
    <div className="space-y-5" id="vocab-treasure">
      {/* Dynamic Header */}
      <div className="bg-[#fffdf2] border-2 border-amber-200 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-amber-900 text-sm md:text-base flex items-center gap-1.5">
            <span>✨ {currentChapter.numText} 好词好句百宝箱</span>
          </h3>
          <p className="text-xs text-amber-800/80 leading-relaxed mt-0.5">
            点击这些卡片，可以看好词好句背后的<b>魔法秘密</b>！大声读一读或者把它们收藏到摘抄本里吧！
          </p>
        </div>
        <div className="text-3xl">🎒</div>
      </div>

      {/* Mini notification banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-amber-500 text-white font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-md text-center flex items-center justify-center gap-2 relative z-20"
          >
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of flashcards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vocabList.map((vocab) => {
          const isOpen = activeCardId === vocab.id;
          const isCollected = collectedWords.includes(vocab.id);
          const isReading = readingId === vocab.id;

          return (
            <div
              key={vocab.id}
              id={`vocab-card-${vocab.id}`}
              onClick={() => handleCardClick(vocab.id)}
              className={`bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                isOpen 
                  ? 'border-amber-400 bg-amber-50/20 shadow-sm' 
                  : 'border-amber-100/80 hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col h-full justify-between gap-3">
                
                {/* Word display & main interaction */}
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                      精选摘抄
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">点击展开解释</span>
                  </div>

                  <h4 className="font-bold text-gray-800 text-sm md:text-base mt-2.5 tracking-wide leading-relaxed pl-1 border-l-3 border-amber-400">
                    {vocab.phrase}
                  </h4>

                  {/* Expandable Explanation with smooth Height animation */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 mt-3">
                          <p className="text-[10px] font-bold text-amber-800 flex items-center gap-1 mb-1">
                            <span>💡 这句话什么意思？</span>
                          </p>
                          <p className="text-xs text-[#5c4a37] leading-relaxed">
                            {vocab.meaning}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Card footer buttons */}
                <div className="border-t border-dashed border-gray-100 pt-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    {/* Read Button */}
                    <button
                      id={`btn-read-${vocab.id}`}
                      onClick={(e) => handleReadAloud(vocab, e)}
                      disabled={isReading}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isReading
                          ? 'bg-amber-100 text-amber-700 animate-pulse'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100'
                      }`}
                    >
                      <Volume2 size={13} className={isReading ? 'animate-bounce' : ''} />
                      <span>{isReading ? '朗读中...' : '🗣️ 我会读'}</span>
                    </button>
                  </div>

                  {/* Collect Button */}
                  <button
                    id={`btn-collect-${vocab.id}`}
                    onClick={(e) => handleCollect(vocab, e)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isCollected
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xs'
                    }`}
                  >
                    {isCollected ? (
                      <>
                        <CheckCircle2 size={13} />
                        <span>已收藏</span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={13} />
                        <span>⭐ 收藏到摘抄本</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
