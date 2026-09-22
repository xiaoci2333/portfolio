const image = (file, alt) => ({ src: `${import.meta.env.BASE_URL}images/${file}.webp`, alt });

export const projects = [
  {
    id: 'earbuds-listing', category: 'amazon', categoryLabel: '亚马逊产品视觉',
    title: '耳夹式蓝牙耳机', subtitle: '从产品细节，到真实使用场景',
    description: '家居、办公与户外场景搭建，结合产品精修与光影统一，呈现一套适合商品页面的产品视觉。',
    tags: ['产品精修', '场景合成', '商品页面'],
    images: [image('earbuds-home', '耳机 · 北欧家居桌面'), image('earbuds-office', '耳机 · 极简办公桌面'), image('earbuds-outdoor', '耳机 · 户外佩戴'), image('earbuds-detail', '耳机 · 产品细节')],
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
