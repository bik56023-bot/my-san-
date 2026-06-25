import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Star, Trophy, BookOpen, Scroll, Shield, 
  ShoppingBag, History, Smile, HelpCircle, ChevronRight, 
  Lock, CheckCircle2, ChevronLeft, Map, Play, Award, Zap
} from 'lucide-react';

import { characters, chapters, shopItems, ChapterData } from './data/janeEyreData';
import { playSound } from './utils/audio';

import Companion from './components/Companion';
import CharacterCards from './components/CharacterCards';
import VocabularyTreasure from './components/VocabularyTreasure';
import QuizSection from './components/QuizSection';
import DiaryWorkshop from './components/DiaryWorkshop';

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function App() {
  // --- STATE SYSTEM ---
  const [stars, setStars] = useState<number>(20); // Start with 20 star coins
  const [activeStep, setActiveStep] = useState<number>(0); // Active stepping stone (0: cast, 1: ch1, 2: ch2, 3: ch3, 4: diary)
  const [collectedWords, setCollectedWords] = useState<string[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([]);
  const [feedCount, setFeedCount] = useState<number>(0);
  const [boughtStickers, setBoughtStickers] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([
    "🎉 开始了《简爱》童心精读大探险之旅！"
  ]);

  // Badge list state
  const [badges, setBadges] = useState<Badge[]>([
    { id: "badge_c1", name: "红房子勇士", emoji: "🛡️", description: "完成第一章思考关卡并打开宝箱", unlocked: false },
    { id: "badge_c2", name: "真话守护者", emoji: "⚖️", description: "完成第二章思考关卡并打开宝箱", unlocked: false },
    { id: "badge_c3", name: "温柔倾听者", emoji: "👂", description: "完成第三章思考关卡并打开宝箱", unlocked: false },
    { id: "badge_writer", name: "精读大作家", emoji: "🏆", description: "在写作工坊保存了一篇精读日记", unlocked: false },
    { id: "badge_painter", name: "绘图大宗师", emoji: "🎨", description: "在绘画板成功画下心中的简爱并提交", unlocked: false },
    { id: "badge_friend", name: "阿福的挚友", emoji: "🐿️", description: "给萌伴阿福买零食投喂了 2 次以上", unlocked: false },
  ]);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // --- DERIVED STATE ---
  // Level & Rank calculations
  const levelData = (() => {
    if (stars < 40) {
      return { lv: 1, rank: "🌱 初学朗读者", nextCap: 40, exp: stars };
    } else if (stars < 90) {
      return { lv: 2, rank: "🎨 勇敢探索家", nextCap: 90, exp: stars };
    } else if (stars < 160) {
      return { lv: 3, rank: "🏆 智慧小书童", nextCap: 160, exp: stars };
    } else {
      return { lv: 4, rank: "👑 故事大王", nextCap: 200, exp: stars };
    }
  })();

  // Track feeding increase
  const prevStars = React.useRef(stars);
  useEffect(() => {
    // If stars decreased and previous action was buy-food, we can count feed
    if (stars < prevStars.current) {
      const diff = prevStars.current - stars;
      if (diff === 10 || diff === 30) {
        setFeedCount(prev => {
          const next = prev + 1;
          if (next >= 2) {
            handleUnlockBadge("badge_friend", "阿福的挚友", "🐿️");
          }
          return next;
        });
      }
    }
    prevStars.current = stars;
  }, [stars]);

  // --- HELPERS ---
  const handleAddLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`⏰ [${time}] ${msg}`, ...prev]);
  };

  const handleUnlockBadge = (badgeId: string, badgeName: string, badgeEmoji: string) => {
    setBadges(prev => {
      const idx = prev.findIndex(b => b.id === badgeId);
      if (idx !== -1 && !prev[idx].unlocked) {
        playSound('levelup');
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          unlocked: true,
          unlockedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        setToastMsg(`🏅 恭喜解锁新荣誉！你获得了【${badgeEmoji} ${badgeName}】金牌勋章！`);
        handleAddLog(`勋章解锁：获得了勋章【${badgeName}】！`);
        setTimeout(() => setToastMsg(null), 4000);
        return updated;
      }
      return prev;
    });
  };

  const handleBuySticker = (id: string, name: string, price: number, emoji: string) => {
    if (stars < price) {
      playSound('error');
      setToastMsg(`❌ 星星糖不足，还需要 ${price - stars} 颗星星才能买【${name}】。`);
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    if (boughtStickers.includes(emoji)) {
      playSound('error');
      setToastMsg(`⚠️ 你已经拥有【${name}】贴纸了哦！快去日记本贴纸夹看看吧。`);
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    playSound('success');
    setStars(prev => prev - price);
    setBoughtStickers(prev => [...prev, emoji]);
    handleAddLog(`购买贴纸：用 ${price} 颗星买下【${emoji} ${name}】贴纸`);
    setToastMsg(`🎉 成功买下【${emoji} ${name}】贴纸！已放入你的日记信件夹，可以随心贴上啦！`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStepChange = (stepIdx: number) => {
    playSound('click');
    setActiveStep(stepIdx);
  };

  const currentChapter = chapters.find(c => c.id === activeStep) || chapters[0];

  return (
    <div className="min-h-screen pb-16 bg-[#fefcf6] text-[#332f27] px-4 sm:px-6 lg:px-8 selection:bg-amber-100" id="main-root">
      
      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-amber-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 max-w-md text-center"
          >
            <Sparkles size={16} className="animate-spin text-amber-200" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto pt-6 pb-4 border-b-2 border-dashed border-amber-200" id="main-header">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl animate-bounce-slow">📖</span>
            <div>
              <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight text-amber-900 flex items-center gap-1.5">
                <span>《简·爱》童心探索</span>
                <span className="text-xs bg-amber-500 text-white font-bold px-2 py-1 rounded-lg">三年级精读本</span>
              </h1>
              <p className="text-xs sm:text-sm text-amber-800/80 font-medium mt-1">
                跟着坚强勇敢的简·爱，体验反抗不公、说真话、学会倾听的探险故事吧！
              </p>
            </div>
          </div>

          {/* Child Profile Widget */}
          <div className="bg-[#fffefa] border-3 border-amber-300 rounded-3xl p-3.5 shadow-sm flex items-center gap-4 self-stretch md:self-auto" id="profile-widget">
            <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl">
              👦
            </div>
            
            <div className="flex-1 min-w-[130px]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-amber-900">{levelData.rank}</span>
                <span className="text-[10px] text-amber-700 bg-amber-100/50 px-1.5 py-0.5 rounded-md font-extrabold">Lv.{levelData.lv}</span>
              </div>
              
              <div className="w-full h-3 bg-amber-50 rounded-full overflow-hidden border border-amber-200">
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                  animate={{ width: `${(levelData.exp / levelData.nextCap) * 100}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-400 font-bold mt-0.5">成长点数：{levelData.exp}/{levelData.nextCap}</p>
            </div>

            {/* Glowing Star Balance */}
            <motion.div 
              id="star-balance-card"
              animate={stars > 20 ? { scale: [1, 1.2, 1] } : {}}
              className="bg-amber-500 text-white rounded-2xl px-4 py-2 text-center shadow-xs cursor-pointer select-none"
              onClick={() => { playSound('success'); }}
            >
              <div className="text-[10px] font-bold tracking-wider uppercase opacity-90">我的星星糖</div>
              <div className="text-lg font-extrabold flex items-center justify-center gap-1">
                <span>🌟</span>
                <span>{stars}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ADVENTURE MAP (BOARD GAME STEPPING PATHWAY) */}
      <section className="max-w-7xl mx-auto py-6" id="adventure-map">
        <div className="bg-[#fffdf7] border-3 border-amber-200/80 rounded-3xl p-5 shadow-inner">
          <h2 className="text-xs font-extrabold text-amber-900 flex items-center gap-1 mb-4">
            <Map size={14} />
            <span>🗺️ 我的《简·爱》读书探险路线图</span>
          </h2>

          {/* Stepping path */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "🗺️ 全书大探险", desc: "人物介绍与全书概览", step: 0 },
              { label: "🚪 第一章精读", desc: "红房子勇敢反抗", step: 1 },
              { label: "⚖️ 第二章精读", desc: "真话呐喊与心声", step: 2 },
              { label: "🧸 第三章精读", desc: "生病关怀与上学路", step: 3 },
              { label: "📜 小作家日记", desc: "手绘简爱与写日记", step: 4 },
            ].map((stone, idx) => {
              const isCurrent = activeStep === stone.step;
              const isChFinished = stone.step >= 1 && stone.step <= 3 && completedQuizzes.includes(stone.step);
              
              return (
                <button
                  key={idx}
                  id={`stepping-stone-${stone.step}`}
                  onClick={() => handleStepChange(stone.step)}
                  className={`relative p-3.5 rounded-2xl border-2 text-left transition-all hover:scale-103 duration-200 flex flex-col justify-between h-24 ${
                    isCurrent
                      ? 'bg-amber-500 border-amber-600 text-white shadow-md -translate-y-1'
                      : 'bg-white border-amber-100 hover:border-amber-300 text-gray-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold line-clamp-1">{stone.label}</div>
                    <div className={`text-[10px] mt-0.5 font-medium leading-relaxed ${isCurrent ? 'text-amber-100' : 'text-gray-400'}`}>
                      {stone.desc}
                    </div>
                  </div>

                  {/* Completion check badges */}
                  <div className="flex justify-between items-center w-full mt-2">
                    <span className="text-[9px] font-bold opacity-80">关卡 {stone.step + 1}</span>
                    {isChFinished && (
                      <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">✓ 答完</span>
                    )}
                  </div>

                  {/* Highlight pulse */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-200"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPANION PET PANEL - FUFU */}
      <section className="max-w-7xl mx-auto mb-6">
        <Companion stars={stars} setStars={setStars} onAddLog={handleAddLog} />
      </section>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6" id="main-interaction-content">
        
        {/* LEFT COLUMN: ACTIVE STEP INTERACTIVE WORKSPACE (7/12) */}
        <section className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* STEP 0: OVERVIEW & CHARACTERS */}
              {activeStep === 0 && (
                <div className="space-y-6" id="overview-and-cast">
                  
                  {/* Storybook Illustrated Introduction */}
                  <div className="bg-white border-3 border-amber-200 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <h2 className="font-extrabold text-amber-900 text-base flex items-center gap-2">
                        <span>《简·爱》童话剧场小广播</span>
                      </h2>
                      <span className="text-2xl">📻</span>
                    </div>

                    <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                      <p>
                        英国作家夏绿蒂·白朗特写了一个非常感人的故事，主角是一个叫 <b>简·爱</b> 的勇敢小女孩。
                      </p>
                      <p className="bg-amber-50/50 p-4 border-l-4 border-amber-400 rounded-xl italic">
                        “简·爱从小就没有了爸爸妈妈。她被狠心的舅妈收养，表哥经常欺负她、拿书砸她的头，还关在黑漆漆的红房子里。但是，简·爱一点都不软弱！她一直坚强地努力读书，长大后当上了家庭教师，还找到了属于自己真正的幸福。”
                      </p>
                      <p className="text-amber-800 font-bold text-center">
                        🌻 这个故事告诉我们：不管遇到多少困难和委屈，都要做一个正直、勇敢、有爱心的人！
                      </p>
                    </div>
                  </div>

                  {/* Characters Profiles cards gallery */}
                  <CharacterCards stars={stars} setStars={setStars} onAddLog={handleAddLog} />
                </div>
              )}

              {/* STEP 1, 2, 3: CHAPTER EXPLORATIONS */}
              {activeStep >= 1 && activeStep <= 3 && (
                <div className="space-y-6" id={`chapter-${activeStep}-workspace`}>
                  
                  {/* Chapter Wisdom Banner */}
                  <div className="bg-white border-3 border-amber-100 rounded-3xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-0.5 rounded-full">
                          {currentChapter.numText} 精读要点
                        </span>
                        <h2 className="font-extrabold text-gray-800 text-base md:text-lg mt-1.5">{currentChapter.title}</h2>
                      </div>
                      <span className="text-2xl">💡</span>
                    </div>

                    <p className="text-xs text-amber-800 font-bold bg-amber-50/50 p-3 rounded-xl leading-relaxed">
                      🌟 本章小道理：{currentChapter.moral}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium pl-2.5">
                      {currentChapter.moralDetail}
                    </p>
                  </div>

                  {/* Vocabulary chest */}
                  <VocabularyTreasure
                    stars={stars}
                    setStars={setStars}
                    activeChapterId={activeStep}
                    collectedWords={collectedWords}
                    setCollectedWords={setCollectedWords}
                    onAddLog={handleAddLog}
                  />

                  {/* Interactive adventure quiz */}
                  <QuizSection
                    stars={stars}
                    setStars={setStars}
                    activeChapterId={activeStep}
                    onUnlockBadge={handleUnlockBadge}
                    completedChapters={completedQuizzes}
                    setCompletedChapters={setCompletedQuizzes}
                    onAddLog={handleAddLog}
                  />
                </div>
              )}

              {/* STEP 4: WRITING DIARY WORKSHOP & PAINT CANVAS */}
              {activeStep === 4 && (
                <div id="creative-notebook-workspace">
                  <DiaryWorkshop
                    stars={stars}
                    setStars={setStars}
                    collectedWords={collectedWords}
                    activeChapterId={1} // Defaults template fill internally or handles switching
                    onUnlockBadge={handleUnlockBadge}
                    onAddLog={handleAddLog}
                    boughtStickers={boughtStickers}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* RIGHT COLUMN: REWARDS CUPBOARD, BADGE CASE & QUEST HISTORIES (4/12) */}
        <section className="lg:col-span-4 space-y-6">
          
          {/* BADGES SHELF / STAR CUPBOARD */}
          <div className="bg-[#fffdf9] border-3 border-amber-200 rounded-3xl p-5 shadow-xs" id="badges-case">
            <h3 className="font-extrabold text-amber-900 text-xs md:text-sm flex items-center gap-1.5 border-b border-amber-100 pb-2.5 mb-3.5">
              <Trophy size={14} className="text-amber-500" />
              <span>🏅 我的闪亮星光勋章柜</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  id={`badge-slot-${badge.id}`}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-help relative group ${
                    badge.unlocked
                      ? 'bg-amber-500/10 border-amber-300 text-amber-950 shadow-xs'
                      : 'bg-gray-50 border-gray-200/60 opacity-40 text-gray-400'
                  }`}
                >
                  <div className={`text-3xl mb-1 ${badge.unlocked ? 'animate-bounce-slow' : ''}`}>
                    {badge.emoji}
                  </div>
                  <div className="text-[10px] font-bold line-clamp-1">{badge.name}</div>
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-gray-900 text-white text-[9px] p-2 rounded-lg shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-30">
                    <p className="font-bold">{badge.name}</p>
                    <p className="text-gray-300 mt-0.5">{badge.description}</p>
                    {badge.unlocked && <p className="text-emerald-400 mt-1 font-bold">✓ {badge.unlockedAt} 已解锁</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STICKER STALL (SHOPPING) */}
          <div className="bg-white border-2 border-amber-100 rounded-3xl p-5 shadow-sm" id="stickers-shop">
            <h3 className="font-extrabold text-[#5c4a37] text-xs md:text-sm flex items-center gap-1.5 border-b border-gray-100 pb-2.5 mb-3.5">
              <ShoppingBag size={14} className="text-amber-600" />
              <span>🛒 星光贴纸魔法铺</span>
            </h3>

            <div className="space-y-2">
              {shopItems.filter(item => item.type === 'sticker').map((item) => {
                const hasSticker = boughtStickers.includes(item.emoji);
                return (
                  <div
                    key={item.id}
                    id={`sticker-stall-item-${item.id}`}
                    className="flex items-center justify-between gap-2 p-2 border border-gray-100 rounded-2xl hover:bg-amber-50/20 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <div className="text-xs font-bold text-gray-800">{item.name}</div>
                        <div className="text-[9px] text-gray-400 font-medium leading-relaxed">{item.description}</div>
                      </div>
                    </div>

                    <button
                      id={`btn-buy-sticker-${item.id}`}
                      onClick={() => handleBuySticker(item.id, item.name, item.price, item.emoji)}
                      disabled={hasSticker}
                      className={`text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-0.5 ${
                        hasSticker
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      {hasSticker ? (
                        <span>已拥有</span>
                      ) : (
                        <>
                          <span>★</span>
                          <span>{item.price}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ADVENTURER QUEST LOGS */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 shadow-xs" id="logs-chest">
            <h3 className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-3">
              <History size={13} className="text-slate-600" />
              <span>🎒 小探险家成长日志</span>
            </h3>

            <div className="h-44 overflow-y-auto space-y-1.5 pr-1 font-mono text-[10px] text-slate-600">
              {logs.map((log, index) => (
                <div key={index} className="leading-relaxed py-0.5 border-b border-slate-100 last:border-0">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}
