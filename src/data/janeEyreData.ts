export interface Character {
  id: string;
  name: string;
  title: string;
  relation: string;
  avatarColor: string;
  avatarEmoji: string;
  description: string;
  traits: string[];
  encouragement: string;
}

export interface Vocabulary {
  id: string;
  phrase: string;
  meaning: string;
  chapter: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export interface ChapterData {
  id: number;
  numText: string;
  title: string;
  subTitle: string;
  moral: string;
  moralDetail: string;
  vocabulary: Vocabulary[];
  questions: QuizQuestion[];
  reflectionTemplate: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description: string;
  type: 'food' | 'sticker';
}

export const characters: Character[] = [
  {
    id: "jane",
    name: "简·爱",
    title: "小小女主角",
    relation: "本书主角",
    avatarColor: "bg-amber-100 border-amber-400 text-amber-700",
    avatarEmoji: "👧",
    description: "从小没有爸爸妈妈疼爱，被舅妈和表哥欺负，但她不软弱。她非常坚强、善良、有主见，敢说真话，不怕坏人！",
    traits: ["勇敢坚强", "爱看书", "敢说真话", "有主见"],
    encouragement: "“谢谢你陪着我，我们一起做个正直勇敢的人吧！”"
  },
  {
    id: "mrs_reed",
    name: "李德舅妈",
    title: "冷漠的监护人",
    relation: "简爱的舅妈",
    avatarColor: "bg-slate-100 border-slate-400 text-slate-700",
    avatarEmoji: "👩‍💼",
    description: "盖茨海德府的女主人，不喜欢简爱，经常冤枉她、惩罚她，把她关进可怕的红房子。是一个冷漠又自私的大人。",
    traits: ["冷漠偏心", "严厉自私", "不讲道理"],
    encouragement: "“哼，你这个不听话的小姑娘……（她看起来很严肃）”"
  },
  {
    id: "john_reed",
    name: "约翰·李德",
    title: "蛮横的表哥",
    relation: "简爱的表哥",
    avatarColor: "bg-red-100 border-red-400 text-red-700",
    avatarEmoji: "👦",
    description: "又胖又凶，仗着自己是家里的继承人，经常无缘无故地欺负简爱，还拿厚厚的书砸简爱的头。脾气非常坏！",
    traits: ["霸道蛮横", "爱欺负人", "脾气暴躁"],
    encouragement: "“你这个寄人篱下的家伙！不准看我的书！（他挥舞着拳头）”"
  },
  {
    id: "bessie",
    name: "贝丝",
    title: "刀子嘴豆腐心的保姆",
    relation: "府上的女仆",
    avatarColor: "bg-teal-100 border-teal-400 text-teal-700",
    avatarEmoji: "👩‍🍳",
    description: "盖茨海德府的保姆。虽然有时候对简爱挺凶的，但其实心地善良，在简爱伤心生病时会偷偷唱歌安慰她，给她温暖。",
    traits: ["善良口硬", "会唱歌", "同情简爱"],
    encouragement: "“快别哭了，小简爱，我给你唱一支好听的歌吧。”"
  },
  {
    id: "mr_lloyd",
    name: "洛伊德先生",
    title: "温柔耐心的药剂师",
    relation: "看病的医生",
    avatarColor: "bg-emerald-100 border-emerald-400 text-emerald-700",
    avatarEmoji: "👨‍⚕️",
    description: "一位心肠极好的药铺先生。在简爱生病害怕时，他不仅温柔地看病，还极其耐心地倾听简爱的伤心事，并提议送她去上学。",
    traits: ["温柔耐心", "擅于倾听", "乐于助人"],
    encouragement: "“别害怕孩子，告诉我，你心里有什么烦恼吗？我听着呢。”"
  },
  {
    id: "rochester",
    name: "罗契斯特先生",
    title: "古怪庄园主",
    relation: "未来的雇主",
    avatarColor: "bg-purple-100 border-purple-400 text-purple-700",
    avatarEmoji: "🤵",
    description: "简爱长大当家庭教师后的雇主。虽然脾气古怪，但内心非常善良，能听懂简爱的心声，和简爱是真正的知己。",
    traits: ["脾气古怪", "心地善良", "深沉智慧"],
    encouragement: "“你有一颗自由高尚的心灵，简。永远不要失去它。”"
  },
  {
    id: "helen",
    name: "海伦·彭斯",
    title: "宽容的天使朋友",
    relation: "学校最好的朋友",
    avatarColor: "bg-pink-100 border-pink-400 text-pink-700",
    avatarEmoji: "👼",
    description: "简爱在罗沃德学校认识的第一个好朋友。她非常宽容、善良，即使面对不公也总是报以温柔，教会了简爱学会宽恕和爱。",
    traits: ["极其温柔", "圣洁宽容", "博学多才"],
    encouragement: "“简，生命太短暂了，不该用来记恨别人的过错。要心怀希望。”"
  },
  {
    id: "miss_temple",
    name: "坦帕小姐",
    title: "公正温柔的老师",
    relation: "学校的女教师",
    avatarColor: "bg-blue-100 border-blue-400 text-blue-700",
    avatarEmoji: "👩‍🏫",
    description: "罗沃德学校的老师，她像一位温暖的母亲。她公正、温柔，给饥饿的孩子们发面包，还帮助简爱澄清被冤枉的谎言。",
    traits: ["公正无私", "温柔高雅", "关爱学生"],
    encouragement: "“只要你做的是对的，正义总会到来。老师一直相信你。”"
  }
];

export const chapters: ChapterData[] = [
  {
    id: 1,
    numText: "第一章",
    title: "红房子的考验",
    subTitle: "反抗不公，勇敢说出来",
    moral: "受了委屈不能偷偷哭，要勇敢地说出来，保护自己！",
    moralDetail: "虽然简爱被约翰表哥欺负，但她没有一直默默忍受，而是勇敢地站出来反抗。这告诉我们，当我们遇到不公平的事情时，要学会保护自己，表达自己的感受。同时，我们自己也绝对不能像表哥那样去欺负、伤害别人哦！",
    vocabulary: [
      {
        id: "v1_1",
        phrase: "“我从不喜欢走远路”",
        meaning: "说明简爱是一个喜欢安静的小女孩，比起在寒风中乱跑，她更喜欢在温暖的屋里读书。",
        chapter: 1
      },
      {
        id: "v1_2",
        phrase: "“红红的窗帘”",
        meaning: "红色的窗帘遮挡住外界。简爱躲在后面读书，其实是想找一个安全的、不被别人欺负的小角落。",
        chapter: 1
      },
      {
        id: "v1_3",
        phrase: "“恐惧”与“打颤”",
        meaning: "这两个词非常生动地写出了简爱对暴躁表哥约翰的害怕，表哥就像一个可怕的小恶魔。",
        chapter: 1
      },
      {
        id: "v1_4",
        phrase: "“像罗马暴君”",
        meaning: "简爱把欺负人的表哥约翰比作残暴的国王，形象地说明了约翰做了多么坏的事，多么横行霸道。",
        chapter: 1
      },
      {
        id: "v1_5",
        phrase: "“邪恶残暴的小孩”",
        meaning: "简爱在被砸伤后，愤怒极了，鼓起勇气大骂表哥。这说明简爱心里有着非常强大的正义感和反抗精神！",
        chapter: 1
      }
    ],
    questions: [
      {
        id: "q1_1",
        question: "简爱为什么不喜欢在冬天里跟着大家去散步？",
        options: [
          "因为外面天寒地冻，冷风刺骨，而且回家还要被保姆责骂，觉得自己比不上高贵的表哥表姐。",
          "因为她今天想去森林里和野兔子一起玩，不想和表哥一起散步。",
          "因为她新买的鞋子太小了，夹得脚指头很痛，走不动路。"
        ],
        correctIdx: 0,
        explanation: "冬天的外面风很大很冷，而且舅妈李德太太不让简爱和表哥表姐坐在一起，保姆贝丝也总是挑刺。所以简爱宁愿在家里静静读书。"
      },
      {
        id: "q1_2",
        question: "约翰·李德表哥对简爱做了什么极其恶劣的坏事？",
        options: [
          "他抢走了简爱的心爱画册，并且把它撕成了碎片扔进火炉里。",
          "他用极其难听的话辱骂简爱是无赖，还恶狠狠地拿厚重的书朝她扔过去，把她的头砸流血了。",
          "他偷偷在简爱的茶杯里放了盐，还抢走了她的下午茶小蛋糕。"
        ],
        correctIdx: 1,
        explanation: "约翰经常打骂简爱，这次更是拿书砸伤了简爱，导致她头破血流。简爱在极度痛苦中终于勇敢地喊出他是“暴君”！"
      },
      {
        id: "q1_3",
        question: "简爱被关进传说中的“红房子”后，她心里是什么感受？",
        options: [
          "她觉得这里很隐秘，像是一个完美的捉迷藏城堡，非常开心。",
          "她害怕极了，因为红房子是疼爱她的李德舅舅去世的地方，光线阴暗，她怕会有灵魂显灵，而且漆黑冰冷，没人陪她。",
          "她觉得红房子非常暖和，很适合在这里蒙上被子舒舒服服睡大觉。"
        ],
        correctIdx: 2,
        explanation: "红房子非常阴森寒冷，又是舅舅去世的地方。年幼的简爱被锁在里面，吓得缩在角落，浑身发抖，留下了深深的阴影。"
      }
    ],
    reflectionTemplate: "在第一章中，最让我难忘的场景是简爱躲在【红窗帘】后面看书。我觉得她的表哥约翰【太粗暴了】。虽然简爱被冤枉关进了红房子，但我觉得她非常【有勇气】，敢大声说出真话！如果我是简爱，我一定会【向大人说出真相，努力保护自己】。"
  },
  {
    id: 2,
    numText: "第二章",
    title: "真话的呐喊",
    subTitle: "被冤枉时，坚持内心的清白",
    moral: "被冤枉时，内心会难受，但一定要始终坚信并说出真相！",
    moralDetail: "简爱明明是被打、受伤害的那个人，可在这个冷酷的盖茨海德府里，大家却说她是“坏孩子”、“像只疯猫似的”。简爱觉得非常委屈，但她心里始终明白自己是无辜的，大喊“不公平”。这种对真相的坚持是非常了不起的，能保护我们的心灵不被谎言伤害。",
    vocabulary: [
      {
        id: "v2_1",
        phrase: "“像只疯猫似的”",
        meaning: "保姆贝丝这样形容简爱，其实是因为简爱在遭到暴打后极度屈辱，拼尽全力进行反抗，这是一种弱小者绝望中的勇敢挣扎。",
        chapter: 2
      },
      {
        id: "v2_2",
        phrase: "“比佣人还不如”",
        meaning: "保姆阿博特说的话非常伤人，意思是简爱没有爸爸妈妈和财产，在这个家里活得连干活的仆人都不如，体现了人情冷暖。",
        chapter: 2
      },
      {
        id: "v2_3",
        phrase: "“不公平！不公平！”",
        meaning: "简爱在红房里痛苦地大喊，这是她对这个不公世界的控诉，她心里有着天然的是非观，知道自己并没有做错任何事。",
        chapter: 2
      },
      {
        id: "v2_4",
        phrase: "“我的理性说道”",
        meaning: "说明简爱虽然年纪小、又处在恐惧中，但她的脑子还在理智地分析，说明她是一个聪明、有思考能力的孩子。",
        chapter: 2
      },
      {
        id: "v2_5",
        phrase: "“我想起曾听过的关于死人的事”",
        meaning: "生动地刻画出简爱在黑屋子里的极度恐慌。周围一团漆黑，冷风吹动，孩子的小脑袋里装满了害怕与幻想。",
        chapter: 2
      }
    ],
    questions: [
      {
        id: "q2_1",
        question: "为什么舅妈和仆人们要把简爱强行锁进可怕的红房子里？",
        options: [
          "因为简爱打碎了李德太太最喜欢的蓝花瓷茶壶，还撒谎不承认。",
          "因为简爱在反抗表哥殴打时，和表哥扭打了起来。冷酷的舅妈偏袒儿子，反而惩罚伤痕累累的简爱。",
          "因为红房子是专门堆放童话书的地方，舅妈希望简爱在里面好好读书反省。"
        ],
        correctIdx: 1,
        explanation: "李德舅妈极度偏心，明明是自己的儿子约翰先挑事拿书砸人，却因为简爱自卫反抗，就把简爱当成凶手强行关押。"
      },
      {
        id: "q2_2",
        question: "在被关押的过程中，仆人们警告简爱要“规矩点”，还对她说了什么伤人的话？",
        options: [
          "说她“在这个家里连地位最低的仆人都不如，应该对主人们感恩戴德”。",
          "说她“要是好好表现，明天舅妈就会送给她一盒精美的水彩画笔”。",
          "说她“其实是一个很聪明的小天才，只是今天不小心犯了错”。"
        ],
        correctIdx: 0,
        explanation: "阿博特和贝丝警告简爱，说她是个寄宿的孤儿，连仆人都不如，如果不乖就会被李德太太扫地出门。这些话深深刺伤了简爱的自尊。"
      },
      {
        id: "q2_3",
        question: "简爱在红房子里大喊“不公平！不公平！”，这表现了她怎样的性格特征？",
        options: [
          "说明她是个非常叛逆、不懂礼貌、喜欢跟大人顶嘴吵架的坏孩子。",
          "表现了简爱具有强烈的是非观念。她虽然年幼，但决不盲目顺从不合理的惩罚，坚持自己的清白，渴望公平。",
          "说明她只是单纯嗓门很大，想通过大喊大叫来吸引别人给她开门。"
        ],
        correctIdx: 1,
        explanation: "“不公平”是全书最震撼的声音之一。简爱虽然弱小，却有一颗渴望平等、崇尚正义的灵魂，这种反抗是不公环境下的坚守。"
      }
    ],
    reflectionTemplate: "读了第二章，听到仆人们说简爱【比佣人还不如】，我感到非常【难过和生气】。简爱被锁在黑屋里大喊【不公平】，我觉得她做得【非常对】！这证明她心里明白自己没有错。在生活中，如果我也被别人误会或者冤枉了，我一定会【像简爱一样坚信自己的清白，勇敢地向信任的人说出真相】。"
  },
  {
    id: 3,
    numText: "第三章",
    title: "温暖的善意",
    subTitle: "倾听是最好的安慰，读书是通往未来的路",
    moral: "当别人难过生病时，耐心倾听他说话，就是一种很大的安慰！",
    moralDetail: "简爱在恐惧中晕倒并生了重病。幸运的是，善良的药铺洛伊德先生来看望她。洛伊德先生不仅给她配药，更重要的是，他坐下来非常耐心地听简爱诉说无依无靠的伤心事。简爱在得到倾听后，心里舒服了许多，还说出了自己想去上学的梦想，这为她打开了人生的新大门。",
    vocabulary: [
      {
        id: "v3_1",
        phrase: "“像从一场噩梦中醒来”",
        meaning: "形容简爱生病发烧、迷迷糊糊的样子。醒来时，身边的红房子消失了，周围变得宁静，让她松了一口气。",
        chapter: 3
      },
      {
        id: "v3_2",
        phrase: "“前所未有的温柔”",
        meaning: "简爱从小只听过冷漠与训斥。洛伊德先生温和的抚摸和贝丝关怀的眼神，是她在这座冰冷房子里极少感受到的阳光。",
        chapter: 3
      },
      {
        id: "v3_3",
        phrase: "“我的心又直往下沉”",
        meaning: "虽然身体在恢复，但一想到李德一家人的冷酷，和自己孤苦伶仃的身世，简爱的心里就充满着无比的孤独和伤感。",
        chapter: 3
      },
      {
        id: "v3_4",
        phrase: "“落寞哀愁的歌”",
        meaning: "保姆贝丝在床边唱起悲伤的流浪汉歌谣。优美而凄凉的旋律触动了简爱的心灵，让她忍不住流下了眼泪。",
        chapter: 3
      },
      {
        id: "v3_5",
        phrase: "“我害怕得快要窒息了”",
        meaning: "窒息代表喘不过气。这写出了红房子事件留给简爱的心理创伤有多深，只要一回想，就觉得胸口发闷、极其痛苦。",
        chapter: 3
      }
    ],
    questions: [
      {
        id: "q3_1",
        question: "简爱在红房里受惊吓晕倒后，是谁来看望她，并用极其温和、亲切的态度照顾她？",
        options: [
          "是平时凶巴巴的李德舅妈。她突然良心发现，亲自给简爱端来热气腾腾的小麦粥。",
          "是善良的药铺先生洛伊德先生。他不仅给简爱把脉，还温柔地询问她为什么哭泣，保姆贝丝也在一旁帮忙端茶。",
          "是学校的冷酷校长。他拿着一根大教鞭，威严地命令简爱立刻从床上爬起来去干活。"
        ],
        correctIdx: 1,
        explanation: "药铺洛伊德先生是一个非常善良、温和的人。他的到来让简爱第一次在盖茨海德府感受到了来自成年人的尊重和温存。"
      },
      {
        id: "q3_2",
        question: "当洛伊德先生耐心地询问简爱为什么不开心时，可怜的简爱吐露了哪些伤心事？",
        options: [
          "她说自己没有爸爸妈妈，也没有亲兄弟姐妹。而且在这个家里，表哥经常狠揍她，舅妈还冤枉她、关押她。",
          "她哭着说自己不小心弄丢了舅妈的一条珍珠项链，害怕舅妈会把她送到警察局去。",
          "她说自己想买糖果吃，但是保姆贝丝不给她零花钱，让她非常委屈。"
        ],
        correctIdx: 0,
        explanation: "简爱把所有的委屈都倾诉给了这位和蔼的医生。没有父母的疼爱，还要忍受虐待和羞辱，是她内心最深切、最真实的痛苦。"
      },
      {
        id: "q3_3",
        question: "洛伊德先生问简爱“你想去上学吗？”，简爱为什么毫不犹豫地大声说“想去”？",
        options: [
          "因为她听说学校里每天都可以吃香喷喷的奶酪蛋糕、玩旋转木马，而且还不用写任何作业。",
          "因为在这个冰冷压抑的家里，她过得极其痛苦、备受歧视。她渴望换一个新环境，通过读书开始独立、崭新的生活！",
          "因为她想在去学校的路上偷偷逃跑，然后去森林里当一个小猎手。"
        ],
        correctIdx: 1,
        explanation: "对于弱小无依的简爱来说，上学是一个能够脱离舅妈魔掌、掌握自己命运的绝佳机会。读书成了她人生第一道希望的曙光。"
      }
    ],
    reflectionTemplate: "在第三章里，【洛伊德先生】的温柔倾听让我感到很温暖。简爱向他倾吐了【自己没有爸爸妈妈、经常挨打】的伤心往事。简爱说她【想去上学】，我觉得她非常有志气，想通过读书改变自己的生活。我也要像洛伊德先生一样，【耐心倾听身边的朋友和同学，给难过的人带去温暖】。"
  }
];

export const shopItems: ShopItem[] = [
  {
    id: "nut_candy",
    name: "七彩坚果糖",
    price: 10,
    emoji: "🍬",
    description: "亮闪闪的松鼠最爱！喂给小松鼠阿福，能让它高兴得在树枝上转个圈！",
    type: "food"
  },
  {
    id: "golden_pinecone",
    name: "黄金超级松果",
    price: 30,
    emoji: "🌰",
    description: "传说中的黄金松果！阿福吃了会长大一点，还会喷出五彩斑斓的闪光小碎屑哦！",
    type: "food"
  },
  {
    id: "sticker_shield",
    name: "“勇气之盾”贴纸",
    price: 15,
    emoji: "🛡️",
    description: "炫酷的闪光护盾，可以贴在你的小日记本上。代表你像简爱一样不畏强权！",
    type: "sticker"
  },
  {
    id: "sticker_quill",
    name: "“智慧羽毛笔”贴纸",
    price: 15,
    emoji: "🪶",
    description: "金灿灿的智慧羽毛笔。贴在日记里，写字会有神奇的智慧魔法加成！",
    type: "sticker"
  },
  {
    id: "sticker_candle",
    name: "“希望烛光”贴纸",
    price: 20,
    emoji: "🕯️",
    description: "暖洋洋的小蜡烛，代表洛伊德先生的善意。贴在日记里，能照亮所有的黑暗！",
    type: "sticker"
  },
  {
    id: "sticker_heart",
    name: "“爱心勋章”贴纸",
    price: 20,
    emoji: "💖",
    description: "粉嘟嘟的大爱心，代表温暖与宽容。贴在日记里，可以让整页都变得亮晶晶！",
    type: "sticker"
  }
];

export const encouragements = [
  "“你今天读了这么多书，真是个了不起的学习小天才！”",
  "“听说你拿到了好多星星？太棒了，快去星光小铺给阿福买糖吃吧！”",
  "“简爱是个坚强的小女孩，我相信你也是个勇敢独立的孩子！”",
  "“遇到困难的时候，想一想简爱大喊‘不公平’的勇气，我们不要害怕！”",
  "“洛伊德先生说，愿意倾听别人说话的小孩，心肠都是最善良的。”",
  "“今天写一篇读书笔记，可以解锁闪亮的‘金牌大作家’勋章哦！”"
];
