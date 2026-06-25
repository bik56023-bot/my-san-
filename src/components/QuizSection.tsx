import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Star, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { chapters, QuizQuestion } from '../data/janeEyreData';
import { playSound } from '../utils/audio';

interface QuizSectionProps {
  stars: number;
  setStars: React.Dispatch<React.SetStateAction<number>>;
  activeChapterId: number;
  onUnlockBadge: (badgeId: string, badgeName: string, badgeEmoji: string) => void;
  completedChapters: number[];
  setCompletedChapters: React.Dispatch<React.SetStateAction<number[]>>;
  onAddLog: (log: string) => void;
}

export default function QuizSection({
  stars,
  setStars,
  activeChapterId,
  onUnlockBadge,
  completedChapters,
  setCompletedChapters,
  onAddLog
}: QuizSectionProps) {
  const currentChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];
  const questions = currentChapter.questions;

  // Track quiz progress states
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  
  // Chest state
  const [quizFinished, setQuizFinished] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);

  // Reset quiz state whenever active chapter changes
  useEffect(() => {
    setCurrentQIndex(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
    setChestOpened(false);
  }, [activeChapterId]);

  const currentQuestion: QuizQuestion = questions[currentQIndex];

  const handleOptionClick = (optIdx: number) => {
    if (isAnswered) return; // Prevent multiple clicks

    setSelectedOpt(optIdx);
    setIsAnswered(true);

    const isCorrect = optIdx === currentQuestion.correctIdx;

    if (isCorrect) {
      playSound('success');
      setScore(prev => prev + 10);
      setCorrectAnswersCount(prev => prev + 1);
      setStars(prev => prev + 10); // Award 10 stars immediately
      onAddLog(`思考题挑战：第 ${activeChapterId} 章 第 ${currentQIndex + 1} 题回答正确，获得 10 颗星`);
    } else {
      playSound('error');
      onAddLog(`思考题挑战：第 ${activeChapterId} 章 第 ${currentQIndex + 1} 题回答错误`);
    }
  };

  const handleNextQuestion = () => {
    playSound('click');
    setSelectedOpt(null);
    setIsAnswered(false);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Quiz finished
      setQuizFinished(true);
      playSound('levelup');
    }
  };

  const handleOpenChest = () => {
    if (chestOpened) return;
    
    playSound('levelup');
    setChestOpened(true);
    
    // Earn extra +15 Stars
    setStars(prev => prev + 15);
    
    // Unlock corresponding chapter badge
    let badgeId = "";
    let badgeName = "";
    let badgeEmoji = "";
    
    if (activeChapterId === 1) {
      badgeId = "badge_c1";
      badgeName = "红房子勇士";
      badgeEmoji = "🛡️";
    } else if (activeChapterId === 2) {
      badgeId = "badge_c2";
      badgeName = "真话守护者";
      badgeEmoji = "⚖️";
    } else {
      badgeId = "badge_c3";
      badgeName = "温柔倾听者";
      badgeEmoji = "👂";
    }

    onUnlockBadge(badgeId, badgeName, badgeEmoji);

    if (!completedChapters.includes(activeChapterId)) {
      setCompletedChapters(prev => [...prev, activeChapterId]);
    }
    
    onAddLog(`宝箱开启：完成了第 ${activeChapterId} 章挑战，打开金币宝箱获得额外 15 颗星，并解锁【${badgeName}】勋章！`);
  };

  const handleRestartQuiz = () => {
    playSound('click');
    setCurrentQIndex(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
    setChestOpened(false);
  };

  return (
    <div className="bg-[#fcfdfa] border-3 border-emerald-100 rounded-3xl p-5 shadow-xs" id="adventure-quiz">
      
      {/* Quiz Progress Header */}
      {!quizFinished && (
        <div className="flex justify-between items-center border-b border-emerald-100 pb-3 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🧗</span>
            <div>
              <h3 className="font-bold text-emerald-800 text-sm md:text-base">
                思考探险关卡：第 {currentQIndex + 1} / {questions.length} 题
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">每答对一题可以奖励 10 颗星星糖！</p>
            </div>
          </div>
          
          {/* Visual Progress Steps */}
          <div className="flex gap-1.5">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  idx === currentQIndex
                    ? 'bg-emerald-500 text-white animate-bounce-slow'
                    : idx < currentQIndex
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUIZ MAIN AREA */}
      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentQIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Question Text */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex gap-2.5">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                Q
              </div>
              <p className="font-bold text-gray-800 text-sm md:text-base leading-relaxed pt-0.5">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5" id={`options-list-q-${currentQIndex}`}>
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrectAnswer = idx === currentQuestion.correctIdx;
                
                let btnStyle = "border-gray-200/80 bg-white hover:bg-emerald-50/20 hover:border-emerald-300";
                let textStyle = "text-gray-700";
                let icon = <div className="w-5 h-5 rounded-full border border-gray-300 shrink-0" />;

                if (isAnswered) {
                  if (isCorrectAnswer) {
                    btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-medium";
                    icon = <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />;
                  } else if (isSelected) {
                    btnStyle = "border-rose-400 bg-rose-50 text-rose-800";
                    icon = <AlertTriangle size={18} className="text-rose-500 shrink-0" />;
                  } else {
                    btnStyle = "border-gray-100 bg-gray-50/50 opacity-60 cursor-default";
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`opt-btn-${currentQIndex}-${idx}`}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full border-2 rounded-2xl p-3.5 text-left text-xs md:text-sm flex items-start gap-3 transition-all ${btnStyle}`}
                  >
                    {icon}
                    <span className={`pt-0.5 leading-relaxed ${textStyle}`}>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Explanations Panel */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-4 border ${
                  selectedOpt === currentQuestion.correctIdx
                    ? 'bg-emerald-500/10 border-emerald-200 text-emerald-950'
                    : 'bg-rose-500/10 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs md:text-sm mb-1">
                  {selectedOpt === currentQuestion.correctIdx ? (
                    <>
                      <Sparkles size={16} className="text-emerald-600 animate-spin" />
                      <span className="text-emerald-700">太棒啦！回答完全正确！星星糖 +10 🌟</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} className="text-rose-600" />
                      <span className="text-rose-700">哎呀，差了一点点！不过没关系，多看书就会啦！</span>
                    </>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed font-medium pl-1 border-l-2 border-emerald-400/50 mt-1.5">
                  <b>💡 听听阿福的解析：</b>{currentQuestion.explanation}
                </p>

                <div className="flex justify-end mt-3">
                  <button
                    id="btn-next-question"
                    onClick={handleNextQuestion}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-sm transition-all hover:translate-x-1"
                  >
                    <span>{currentQIndex === questions.length - 1 ? "查看探险报告" : "下一题"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* QUIZ COMPLETION / TREASURE CHEST OPENING */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-5"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl shadow-inner animate-bounce-slow">
                🏆
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-gray-800 text-lg md:text-xl">
                恭喜你完成《简爱》{currentChapter.numText}思考探险！
              </h3>
              <p className="text-xs text-emerald-700 font-bold">
                这一轮答对题数：<span className="text-sm">{correctAnswersCount} / 3</span>
              </p>
            </div>

            {/* Magical Treasure Chest Container */}
            <div className="bg-amber-50/50 border-2 border-amber-200/80 rounded-2xl p-5 max-w-sm mx-auto shadow-sm relative overflow-hidden" id="treasure-chest-panel">
              {!chestOpened ? (
                <div className="space-y-3">
                  <div className="text-5xl cursor-pointer hover:scale-115 active:scale-95 duration-200" onClick={handleOpenChest} id="tap-chest-btn">
                    📦
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-amber-900 text-xs md:text-sm">发现了一个被锁上的【星光宝箱】！</p>
                    <p className="text-[10px] text-gray-400 font-medium">点击宝箱打开它，领取大奖和专属勋章吧！</p>
                  </div>
                  <button
                    id="open-chest-button"
                    onClick={handleOpenChest}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-extrabold text-xs py-2 rounded-xl shadow-xs"
                  >
                    🔑 开启宝箱
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="text-5xl animate-bounce">
                    🔓👑🎁
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-bold text-emerald-800 text-xs md:text-sm">
                      哇！宝箱盛大开启！
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold bg-white border border-amber-100 px-3 py-1 rounded-xl w-fit mx-auto shadow-inner">
                      <span>★ 额外星星 +15 颗！</span>
                      <span>•</span>
                      <span>解锁【
                        {activeChapterId === 1 ? "🛡️ 红房子勇士" : activeChapterId === 2 ? "⚖️ 真话守护者" : "👂 温柔倾听者"}
                      】专属勋章！</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    勋章已经默默送到了你的<b>星星勋章柜</b>中，阿福在零食小铺等着你带好吃的去找它！
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 justify-center">
              <button
                id="btn-restart-quiz"
                onClick={handleRestartQuiz}
                className="border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/20 text-emerald-700 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 transition-all"
              >
                <RefreshCw size={12} />
                <span>再挑战一次</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
