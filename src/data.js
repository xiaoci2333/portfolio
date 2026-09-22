const image = (file, alt) => ({ src: `${import.meta.env.BASE_URL}images/${file}.webp`, alt });

export const projects = [
  {
    id: 'earbuds-listing', category: 'amazon', categoryLabel: '亚马逊产品视觉',
    title: '耳夹式耳机 · 亚马逊商品图', subtitle: '一套六张图，从产品外观到使用场景',
    description: '围绕象牙白与金色的产品风格，组织白底主图、佩戴场景、细节说明与卖点汇总。统一英文排版和画面色调，让商品信息更清晰。',
    tags: ['白底主图', '场景辅图', '卖点信息图'],
    coverLayout: 'amazon',
    images: [
      { ...image('amazon-earbuds-01', "白底主图 · 产品与充电仓"), note: "用简洁白底突出耳机与充电仓的外观，让产品形态成为第一视觉焦点。" },
      { ...image('amazon-earbuds-02', "户外佩戴 · 直观呈现上耳效果"), note: "结合佩戴近景与产品特写，展示耳夹结构和开放式外观。" },
      { ...image('amazon-earbuds-03', "设计细节 · 象牙白与金色质感"), note: "通过局部放大与英文标注，说明配色、造型和充电仓设计。" },
      { ...image('amazon-earbuds-04', "日常场景 · 咖啡馆穿搭"), note: "用日常咖啡馆场景建立生活联想，统一人物、服装与产品的视觉调性。" },
      { ...image('amazon-earbuds-05', "便携展示 · 充电仓与随身配饰"), note: "将产品放入随身物品场景，直观表现充电仓尺寸感与携带方式。" },
      { ...image('amazon-earbuds-06', "卖点汇总 · 四个设计亮点"), note: "以四个局部视图整理外观信息，帮助浏览者快速理解设计特点。" }
    ],
  },
  {
    id: 'earbuds-video', category: 'video', categoryLabel: '产品短视频',
    title: '耳机 · 15秒产品短片', subtitle: '用简洁镜头，讲清产品卖点',
    description: '通过开盖展示、结构特写和佩戴画面，完成脚本、AI素材生成与后期剪辑。',
    tags: ['脚本策划', '镜头设计', '剪辑调色'],
    images: [image('earbuds-video', '耳机广告视频 · 第3秒画面')],
  },
  {
    id: 'coat-koc', category: 'social', categoryLabel: 'TikTok / 社媒',
    title: '大毛领皮风衣', subtitle: '贴近北美日常的达人穿搭',
    description: '围绕穿搭分享设计人物、场景与分镜，以自然的生活化画面呈现服装质感。',
    tags: ['达人穿搭', '分镜设计', '社媒内容'],
    images: [image('coat-koc', '皮风衣 · 镜前穿搭场景')],
  },
  {
    id: 'leather-coat', category: 'video', categoryLabel: '产品短视频',
    title: '皮革大衣 · 品牌广告', subtitle: '让光影呈现材质本身',
    description: '用克制的布景与光影突出皮质细节，完成品牌视觉方向、分镜与后期包装。',
    tags: ['品牌视觉', '材质表达', '后期包装'],
    images: [image('leather-coat', '皮革大衣 · 主视觉锚点')],
  },
  {
    id: 'cleanser', category: 'video', categoryLabel: '产品短视频',
    title: '净澈洁面 · 品牌广告', subtitle: '干净画面里的细腻质感',
    description: '从创意策划到产品展示，通过泡沫与细节特写传达个护产品的视觉感受。',
    tags: ['个护广告', '创意策划', '质感特写'],
    images: [image('cleanser', '洁面泡沫 · 广告视觉')],
  },
  {
    id: 'denim', category: 'social', categoryLabel: 'TikTok / 社媒',
    title: '美式牛仔休闲套装', subtitle: '30秒穿搭分享，抓住开头注意力',
    description: '以真人分享风格组织开头、产品展示和穿搭场景，适配海外社媒广告内容。',
    tags: ['广告素材', '开头设计', '穿搭分享'],
    images: [image('denim', '牛仔套装广告 · 第12秒画面')],
  },
];

export const skills = [
  { title: 'AI出图', text: '场景生成、产品视觉、提示词编写与素材筛选。' },
  { title: '视频制作', text: '分镜、剪辑、字幕、配音与调色，完成从脚本到成片的制作。' },
  { title: '平面设计', text: '产品精修、抠图合成、版式设计与统一视觉风格。' },
  { title: '内容与数据', text: '理解海外社媒节奏，结合完播、互动等数据调整内容。' },
];

export const roles = [
  { title: '亚马逊产品视觉', text: '主图、场景辅图与商品详情页，让产品卖点一眼可见。' },
  { title: 'AIGC视频制作', text: '从创意脚本到素材生成、剪辑调色，完成产品短片。' },
  { title: '海外社媒内容', text: '达人穿搭、产品种草与广告素材，适配TikTok等平台。' },
  { title: '跨境品牌视觉', text: '产品海报、广告主视觉与视频封面，形成统一表达。' },
];

export const workflow = [
  { title: '明确需求', text: '梳理产品卖点、目标用户和使用平台。' },
  { title: '策划与生成', text: '确定视觉方向，编写分镜并生成素材。' },
  { title: '精修与剪辑', text: '统一光影色调，完成画面、声音与节奏。' },
  { title: '交付与优化', text: '按平台规格输出，并结合反馈继续迭代。' },
];
