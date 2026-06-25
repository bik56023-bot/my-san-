import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Sparkles, PenTool, Edit3, Trash2, CheckCircle, Palette, Brush, Eraser } from 'lucide-react';
import { chapters, Vocabulary, shopItems } from '../data/janeEyreData';
import { playSound } from '../utils/audio';

interface DiaryWorkshopProps {
  stars: number;
  setStars: React.Dispatch<React.SetStateAction<number>>;
  collectedWords: string[];
  activeChapterId: number;
  onUnlockBadge: (badgeId: string, badgeName: string, badgeEmoji: string) => void;
  onAddLog: (log: string) => void;
  boughtStickers: string[]; // Track stickers bought by the kid
}

interface SavedDiary {
  id: string;
  chapterId: number;
  chapterTitle: string;
  content: string;
  savedAt: string;
  stickers: string[]; // Stickers attached to this diary entry
}

interface SavedDrawing {
  id: string;
  dataUrl: string;
  savedAt: string;
}

export default function DiaryWorkshop({
  stars,
  setStars,
  collectedWords,
  activeChapterId,
  onUnlockBadge,
  onAddLog,
  boughtStickers
}: DiaryWorkshopProps) {
  // Diary list and editing state
  const [savedDiaries, setSavedDiaries] = useState<SavedDiary[]>([]);
  const [currentDiaryContent, setCurrentDiaryContent] = useState('');
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Drawing Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#332f27');
  const [brushSize, setBrushSize] = useState(4);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [savedDrawings, setSavedDrawings] = useState<SavedDrawing[]>([]);

  // Open-ended answers
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, string>>({
    q1: "",
    q2: ""
  });
  const [challengeSubmitted, setChallengeSubmitted] = useState<Record<string, boolean>>({});

  // Auto-fill template on chapter shift
  useEffect(() => {
    const currentChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];
    setCurrentDiaryContent(currentChapter.reflectionTemplate);
    setSelectedStickers([]);
  }, [activeChapterId]);

  // Handle diary save
  const handleSaveDiary = () => {
    if (currentDiaryContent.trim().length < 15) {
      playSound('error');
      setSuccessMsg("⚠️ 写得有点短哦！再写几句话，凑够 15 个字再保存吧，加油！✍️");
      setTimeout(() => setSuccessMsg(null), 3000);
      return;
    }

    playSound('success');
    const currentChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];
    
    // Check if updating or creating new
    const newDiary: SavedDiary = {
      id: `${Date.now()}`,
      chapterId: activeChapterId,
      chapterTitle: currentChapter.title,
      content: currentDiaryContent,
      savedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      stickers: [...selectedStickers]
    };

    setSavedDiaries(prev => [newDiary, ...prev]);
    setStars(prev => prev + 15);
    onUnlockBadge("badge_writer", "精读小作家", "🏆");
    onAddLog(`写作工坊：撰写了【第 ${activeChapterId} 章】精读日记，获得 15 颗星并解锁【精读小作家】勋章`);
    
    setSuccessMsg("📝 宝贝太棒啦！精读日记保存成功！星星糖 +15 🌟 已解锁【精读小作家】勋章！");
    setSelectedStickers([]);
    
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDeleteDiary = (id: string) => {
    playSound('click');
    setSavedDiaries(prev => prev.filter(d => d.id !== id));
    onAddLog(`写作工坊：删除了日记条目`);
  };

  // Canvas Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Support both mouse and touch drawing for kids on tablets
    const rect = canvas.getBoundingClientRect();
    const clientX = ('touches' in e) ? e.touches[0].clientX : e.clientX;
    const clientY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    // Prevent scrolling when drawing on touchscreen devices
    if ('touches' in e) {
      e.preventDefault();
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = ('touches' in e) ? e.touches[0].clientX : e.clientX;
    const clientY = ('touches' in e) ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    playSound('click');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSaveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) {
      playSound('error');
      setSuccessMsg("⚠️ 画板空空的哦，试着涂鸦一两笔再提交吧！🎨");
      setTimeout(() => setSuccessMsg(null), 3000);
      return;
    }

    playSound('success');
    const dataUrl = canvas.toDataURL();
    const newDrawing: SavedDrawing = {
      id: `${Date.now()}`,
      dataUrl,
      savedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    setSavedDrawings(prev => [newDrawing, ...prev]);
    setStars(prev => prev + 15);
    onUnlockBadge("badge_painter", "绘图大宗师", "🎨");
    onAddLog(`创意绘画：画下了心中的简·爱并提交，获得 15 颗星并解锁【绘图大宗师】勋章`);
    
    setSuccessMsg("🎨 哇！你画的简·爱太精彩啦！绘画保存成功！星星糖 +15 🌟 解锁【绘图大宗师】勋章！");
    
    // Clear canvas for next artwork
    clearCanvas();
    
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleChallengeSubmit = (key: 'q1' | 'q2', title: string) => {
    const text = challengeAnswers[key];
    if (text.trim().length < 5) {
      playSound('error');
      setSuccessMsg("⚠️ 写得太简短啦，再多写几个字吧，真棒！✍️");
      setTimeout(() => setSuccessMsg(null), 3000);
      return;
    }

    playSound('success');
    setChallengeSubmitted(prev => ({ ...prev, [key]: true }));
    setStars(prev => prev + 10);
    onAddLog(`延伸小任务：完成了问答【${title}】，获得 10 颗星`);
    setSuccessMsg(`🎉 延伸任务完成！获得 +10 颗星星糖！你非常有自己的想法！🌟`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const toggleSticker = (stickerEmoji: string) => {
    playSound('click');
    if (selectedStickers.includes(stickerEmoji)) {
      setSelectedStickers(prev => prev.filter(s => s !== stickerEmoji));
    } else {
      setSelectedStickers(prev => [...prev, stickerEmoji]);
    }
  };

  // Resolve matching vocabulary items
  const currentChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];
  const allVocabMap: Record<string, Vocabulary> = {};
  chapters.forEach(c => c.vocabulary.forEach(v => { allVocabMap[v.id] = v; }));

  return (
    <div className="space-y-8" id="diary-workshop">
      
      {/* Floating Success Notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Writing Pad (Lined paper notebook) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#fffdf8] border-3 border-amber-200 rounded-3xl p-5 shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-amber-900 text-sm md:text-base flex items-center gap-1.5">
                <PenTool size={18} />
                <span>✍️ {currentChapter.numText} 精读日记本</span>
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                字数：{currentDiaryContent.length}
              </span>
            </div>

            <p className="text-xs text-amber-800/80 mb-3 leading-relaxed">
              小朋友，在下面的“信纸”上修改或者填空，也可以写下你自己对<b>《简爱》{currentChapter.title}</b>最真实的心声哦。保存就能得到 <b>15 颗星星</b>！
            </p>

            {/* Simulated Lined Paper Textarea */}
            <div className="relative border-2 border-amber-100 rounded-2xl bg-amber-50/20 p-4 shadow-sm">
              <textarea
                id="diary-input-textarea"
                rows={7}
                value={currentDiaryContent}
                onChange={(e) => setCurrentDiaryContent(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-gray-800 font-sans text-xs md:text-sm leading-8 focus:ring-0 resize-none font-medium placeholder-gray-400"
                style={{
                  backgroundImage: "linear-gradient(rgba(0,0,0,0) 96%, #eddcb9 96%)",
                  backgroundSize: "100% 2rem",
                  lineHeight: "2rem"
                }}
              />
            </div>

            {/* Sticker Decorator */}
            {boughtStickers.length > 0 && (
              <div className="mt-4 bg-white border border-dashed border-amber-200 rounded-2xl p-3">
                <p className="text-[10px] font-bold text-amber-800 mb-2">🎈 贴上你买到的精美贴纸：</p>
                <div className="flex flex-wrap gap-2">
                  {boughtStickers.map((sticker, idx) => {
                    const isSelected = selectedStickers.includes(sticker);
                    return (
                      <button
                        key={idx}
                        id={`attach-sticker-${idx}`}
                        onClick={() => toggleSticker(sticker)}
                        className={`text-2xl p-1.5 rounded-xl transition-all hover:scale-125 ${
                          isSelected ? 'bg-amber-100 border-2 border-amber-400 shadow-xs' : 'bg-transparent border border-transparent'
                        }`}
                      >
                        {sticker}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-[10px] text-gray-400 font-bold">小作家完成啦？</span>
              <button
                id="btn-save-diary"
                onClick={handleSaveDiary}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Edit3 size={15} />
                <span>💾 保存到我的精读日记</span>
              </button>
            </div>
          </div>

          {/* Subscribed Vocabulary drawer */}
          <div className="bg-[#fcfdf9] border border-amber-100 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1 mb-2.5">
              <Bookmark size={13} />
              <span>📚 我的好词摘抄夹 ({collectedWords.length} 句)</span>
            </h4>
            {collectedWords.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">你还没有好词摘抄哦，快去“好词百宝箱”发现好句吧！💖</p>
            ) : (
              <div className="space-y-2">
                {collectedWords.map((id, index) => {
                  const vocab = allVocabMap[id];
                  if (!vocab) return null;
                  return (
                    <div key={index} className="bg-amber-50/30 border border-amber-100 rounded-xl p-2.5 flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md">
                          第 {vocab.chapter} 章
                        </span>
                        <p className="text-xs text-gray-800 font-bold mt-1.5">“{vocab.phrase}”</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{vocab.meaning}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Drawing board & Extension tasks */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Drawing Board */}
          <div className="bg-white border-3 border-amber-200 rounded-3xl p-5 shadow-sm space-y-3" id="drawing-panel">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-amber-900 text-sm flex items-center gap-1.5">
                <Palette size={16} />
                <span>试着画一画你心中的简·爱 🎨</span>
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">画完得15星</span>
            </div>
            
            <p className="text-[11px] text-gray-500 leading-relaxed">
              拿起画笔动动手，用鼠标或在平板上用手指，画出这个坚强、爱看书的小姑娘吧！
            </p>

            {/* Colors & size select */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <div className="flex gap-1.5">
                {['#332f27', '#e11d48', '#16a34a', '#d97706', '#2563eb', '#9333ea'].map((c) => (
                  <button
                    key={c}
                    id={`color-${c.replace('#', '')}`}
                    onClick={() => setDrawColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      drawColor === c ? 'border-amber-400 scale-120 shadow-xs' : 'border-white hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <Brush size={12} />
                <input
                  id="brush-size-slider"
                  type="range"
                  min="2"
                  max="12"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-16 accent-amber-500"
                />
              </div>
            </div>

            {/* The actual Canvas */}
            <div className="border-2 border-amber-100 rounded-2xl overflow-hidden bg-amber-50/10 relative">
              <canvas
                ref={canvasRef}
                id="paint-canvas"
                width={360}
                height={200}
                className="w-full h-[180px] bg-transparent cursor-crosshair touch-none block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              
              {!hasDrawn && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-300 font-bold pointer-events-none italic select-none">
                  在此处随意涂鸦画画 ✨
                </div>
              )}
            </div>

            {/* Paint tools */}
            <div className="flex justify-between items-center gap-2">
              <button
                id="btn-clear-canvas"
                onClick={clearCanvas}
                className="flex items-center gap-1 border border-gray-200 hover:border-amber-300 text-gray-500 hover:text-amber-700 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
              >
                <Eraser size={12} />
                <span>清空画板</span>
              </button>

              <button
                id="btn-submit-drawing"
                onClick={handleSaveDrawing}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-xl flex items-center gap-1 shadow-xs transition-colors"
              >
                <CheckCircle size={12} />
                <span>🎨 确认画完啦！</span>
              </button>
            </div>
          </div>

          {/* Extension Questions Panel */}
          <div className="bg-[#fbfcfa] border border-emerald-100 rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-emerald-900 text-sm flex items-center gap-1">
              <span>延伸思考关卡 🧠</span>
            </h3>

            {/* Task 1 */}
            <div className="border-b border-gray-100 pb-3.5 space-y-2">
              <p className="text-xs text-gray-800 font-bold">
                1. 如果你是简爱，被关进红房时，你会怎么做来让自己不那么害怕？
              </p>
              {!challengeSubmitted.q1 ? (
                <div className="flex gap-2">
                  <input
                    id="ans-input-q1"
                    type="text"
                    placeholder="我会试着深呼吸，或者默默在心里唱歌..."
                    value={challengeAnswers.q1}
                    onChange={(e) => setChallengeAnswers(prev => ({ ...prev, q1: e.target.value }))}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-300 focus:ring-0"
                  />
                  <button
                    id="submit-ans-q1"
                    onClick={() => handleChallengeSubmit('q1', '红房消恐')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-2 rounded-xl"
                  >
                    提交
                  </button>
                </div>
              ) : (
                <p className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <span>✓ 答得真棒：</span>
                  <span className="text-gray-600 font-normal italic">{challengeAnswers.q1}</span>
                </p>
              )}
            </div>

            {/* Task 2 */}
            <div className="space-y-2">
              <p className="text-xs text-gray-800 font-bold">
                2. 你身边有没有像洛伊德先生那样愿意耐心听你说话的大人？是谁？
              </p>
              {!challengeSubmitted.q2 ? (
                <div className="flex gap-2">
                  <input
                    id="ans-input-q2"
                    type="text"
                    placeholder="比如我的妈妈/我的老师，他会听我讲学校发生的事..."
                    value={challengeAnswers.q2}
                    onChange={(e) => setChallengeAnswers(prev => ({ ...prev, q2: e.target.value }))}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-300 focus:ring-0"
                  />
                  <button
                    id="submit-ans-q2"
                    onClick={() => handleChallengeSubmit('q2', '倾听的大人')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-2 rounded-xl"
                  >
                    提交
                  </button>
                </div>
              ) : (
                <p className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <span>✓ 答得真棒：</span>
                  <span className="text-gray-600 font-normal italic">{challengeAnswers.q2}</span>
                </p>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* GALLERY OF PAST WORK */}
      <div className="border-t-2 border-dashed border-gray-200 pt-6">
        <h3 className="font-extrabold text-gray-800 text-sm md:text-base flex items-center gap-1 mb-4">
          <span>📖 我的精读创作展示架</span>
        </h3>

        {savedDiaries.length === 0 && savedDrawings.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-xs text-gray-400 font-bold">
            目前你的创作展示架还是空空如也呢，快写一篇精读笔记或画一幅画来展示吧！⭐
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Diaries list */}
            {savedDiaries.map((diary) => (
              <div key={diary.id} className="bg-amber-50/10 border-2 border-amber-200 rounded-2xl p-4 shadow-xs relative">
                {/* Visual Stickers placed by children */}
                {diary.stickers.length > 0 && (
                  <div className="absolute -top-3 -right-2 flex gap-1 z-10">
                    {diary.stickers.map((st, i) => (
                      <span key={i} className="text-3xl animate-bounce-slow" style={{ animationDelay: `${i * 0.4}s` }}>
                        {st}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    第 {diary.chapterId} 章 • {diary.savedAt}
                  </span>
                  <button
                    id={`btn-delete-diary-${diary.id}`}
                    onClick={() => handleDeleteDiary(diary.id)}
                    className="text-gray-300 hover:text-rose-500 transition-colors p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                
                <p className="text-xs text-gray-700 leading-relaxed font-medium line-clamp-5 border-l-2 border-amber-400 pl-2">
                  {diary.content}
                </p>
              </div>
            ))}

            {/* Drawings list */}
            {savedDrawings.map((draw) => (
              <div key={draw.id} className="bg-white border-2 border-amber-100 rounded-2xl p-3 shadow-xs flex flex-col justify-between gap-2">
                <div className="border border-gray-100 rounded-xl overflow-hidden bg-slate-50">
                  <img src={draw.dataUrl} alt="Children drawing" referrerPolicy="no-referrer" className="w-full h-[120px] object-contain" />
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                  <span>🎨 我画的简·爱</span>
                  <span>{draw.savedAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
