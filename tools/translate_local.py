#!/usr/bin/env python3
"""Apply the project-local Chinese translation pass.

This is deliberately offline: translations come from the curated glossary and
phrase table below. It only writes target fields and never changes source data.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

DEV = Path(__file__).resolve().parents[1]

# Proper nouns and recurring game terminology.
TERMS = {
    "Pandaemonium": "潘德莫尼乌姆", "PAN-DAE-MON-IUM": "潘德莫尼乌姆",
    "Haures": "哈乌瑞斯", "Ipos": "伊波斯", "Glasya-Labolas": "格拉西亚-拉博拉斯",
    "G.Labolas": "格拉西亚-拉博拉斯", "Zepar": "泽帕尔", "Orobas": "奥罗巴斯",
    "Demon": "恶魔", "demons": "恶魔们", "demon": "恶魔", "Boss": "老大",
    "Inferno": "地狱", "Ars Goetia": "所罗门魔典",
    "Attack": "攻击", "Guard": "防御", "Item": "道具", "Skill": "技能",
    "Weapon": "武器", "Armor": "防具", "Shield": "盾牌", "Helmet": "头盔",
    "Accessory": "饰品", "Battle": "战斗", "Victory": "胜利", "Defeat": "败北",
    "Level": "等级", "HP": "生命值", "MP": "魔法值", "TP": "技术值",
    "Health": "生命", "Magic": "魔法", "Strength": "力量", "Defense": "防御",
    "Agility": "敏捷", "Luck": "幸运", "Experience": "经验值", "EXP": "经验值",
    "Save": "保存", "Load": "读取", "Options": "选项", "Config": "设置",
    "Cancel": "取消", "Confirm": "确认", "Yes": "是", "No": "否",
    "New Game": "新游戏", "Continue": "继续游戏", "Game End": "结束游戏",
    "Game Over": "游戏结束", "Title": "标题", "Menu": "菜单", "Status": "状态",
    "Formation": "队形", "Equip": "装备", "Optimize": "最优装备", "Clear": "卸下全部",
    "Party": "队伍", "Members": "成员", "Command": "指令", "Commands": "指令",
    "Buy": "购买", "Sell": "出售", "Shop": "商店", "Gold": "金币", "G": "G",
    "Obtained": "获得", "obtained": "获得", "Nothing happened...": "什么也没有发生……",
    "The enemy got away...": "敌人逃走了……", "The Demon has left the party...": "恶魔已离开队伍……",
    "Please select": "请选择", "PLEASE SELECT": "请选择", "WARNING:": "警告：",
    "For the safety of infernal spirits traversing through": "为了穿越地狱的灵魂安全",
    "THE INFERNO": "地狱",
    "The Boss demands that a pilgrimage to Pandaemonium": "老大要求前往潘德莫尼乌姆的队伍",
    "must contain no more than three party members": "最多只能有三名成员",
    "to send them on their way": "让其离队",
    "The Demon scowls at you.": "恶魔对你怒目而视。",
    "The Demon seems very flustered.": "恶魔显得十分慌乱。",
    "The Demon glares at you for a second.": "恶魔瞪了你一眼。",
    "The Demon remains unmoving.": "恶魔一动不动。",
    "The Demon's eyes are racing.": "恶魔的双眼飞快转动。",
    "Later, losers...": "回头见， losers……",
    "So that's how it is, huh...": "原来是这样啊……",
    "Well I'll show ya!": "那我就让你看看！",
    "I'm gettin' to Pandaemonium on my own!": "我会独自抵达潘德莫尼乌姆！",
    "I'm the best! I don't need no one else": "我是最强的！我不需要任何人",
    "with me...!": "陪着我……！", "Wh-Huh?": "什、什么？",
    "Well then...": "既然如此……", "Suit yourselves!": "随你们便！",
    "As if you lot deserve to be around a": "就凭你们也配待在",
    "Demon of my stature!": "像我这样的大恶魔身边！",
    "Don't expect me to help if we're to cross": "下次再见面时别指望我会帮忙，",
    "paths again.": "如果我们还会再次相遇的话。",
    "I'll kill you if I see you again,": "下次再见到你，我就杀了你，",
    "y'know?": "明白吗？", "I'm sure Boss won't mind a few": "我想老大不会介意几个",
    "no-shows...": "缺席者……", "Then it shall be so.": "那就这样吧。",
    "Huh? Are we racing to Pandaemonium now?!": "咦？现在要比赛去潘德莫尼乌姆吗？！",
    "O-oh... you wanted me to go": "哦……你是想让我",
    "...on my own?": "……独自前往？", "Did I-": "我做错了什么——",
    "But": "可是", "What did I do wrong...?": "我做错了什么……？",
    "Type O Blood obtained.": "获得O型血。", "Unholy Drop obtained.": "获得不洁之滴。",
    "Human Flesh obtained.": "获得人肉。", "Stygian Water obtained.": "获得冥河之水。",
    "Torn Grimoire obtained.": "获得残破魔导书。", "Rusty Dagger obtained.": "获得生锈的匕首。",
    "Rusty Bagh Nakh obtained.": "获得生锈的虎爪。", "Rusty Sickle obtained.": "获得生锈的镰刀。",
    "Lucky Horseshoe obtained.": "获得幸运马蹄铁。", "Big Hat obtained.": "获得大帽子。",
    "Cravat obtained.": "获得领巾。", "Plated Jacket obtained.": "获得板甲外套。",
    "Red Greaves obtained.": "获得红色护胫。", "Weighted Dress obtained.": "获得加重裙。",
    "Cursed Poems A obtained.": "获得诅咒诗篇A。", "Cursed Poems B obtained.": "获得诅咒诗篇B。",
    "Invocative Poems A obtained.": "获得祈唤诗篇A。", "Invocative Poems B obtained.": "获得祈唤诗篇B。",
    "Sickening Poems A obtained.": "获得恶心诗篇A。", "Sickening Poems B obtained.": "获得恶心诗篇B。",
    "CHACHA TRANSFER SYSTEM": "CHACHA转移系统", "HOW TO ADD A NEW CHARACTER": "如何添加新角色",
    "THINGS TO REMEMBER FOR NEW CIRCLES": "新圆环注意事项", "CIRCLE EVENT PLACEMENTS": "圆环事件位置",
    "WEAPONS AND GEAR": "武器与装备", "SPRITES": "精灵图", "TILES": "图块",
    "Hit Physical": "物理命中", "Hit Effect": "命中效果", "Hit Fire": "火焰命中",
    "Hit Ice": "冰霜命中", "Hit Thunder": "雷电命中", "Slash Physical": "物理斩击",
    "Slash Effect": "斩击效果", "Slash Fire": "火焰斩击", "Slash Ice": "冰霜斩击",
    "Slash Thunder": "雷电斩击", "Pierce Physical": "物理突刺", "Pierce Effect": "突刺效果",
    "Pierce Fire": "火焰突刺", "Pierce Ice": "冰霜突刺", "Pierce Thunder": "雷电突刺",
    "Claw Physical": "物理爪击", "Claw Effect": "爪击效果", "Claw Fire": "火焰爪击",
    "Claw Ice": "冰霜爪击", "Claw Thunder": "雷电爪击", "Sonic Wave": "音波",
    "General Special": "通用特殊", "Arrow Special": "箭矢特殊", "Breath": "吐息",
    "Pollen": "花粉", "Darkness": "黑暗", "Poison Swamp": "毒沼",
    "Fire": "火焰", "Ice": "冰", "Thunder": "雷", "Wind": "风", "Water": "水",
    "Physical": "物理", "Special": "特殊", "Effect": "效果", "Attack command": "攻击指令",
    "Guard command": "防御指令", "Tutorial Fight": "教程战斗", "RANDOM ENCOUNTERS": "随机遇敌",
    "Water": "水域", "Waterfall": "瀑布", "Ground": "地面", "Dark Ground": "深色地面",
    "Hole": "洞穴", "Wall": "墙壁", "Ledge": "边缘", "Stairs": "楼梯", "Transparent": "透明",
    "Translucent": "半透明", "Wire Mesh": "铁丝网", "Lava": "熔岩", "Canal": "水渠",
    "Castle": "城堡", "Fort": "要塞", "Temple": "神殿", "Factory": "工厂", "Crystal": "水晶",
    "Frozen": "冰冻", "Marble": "大理石", "Brick": "砖块", "Stone": "石头", "Dirt Cave": "土洞窟",
    "Rock Cave": "岩洞窟", "Lava Cave": "熔岩洞窟", "Ice Cave": "冰洞窟", "Grass Maze": "草迷宫",
    "Demonic World": "魔界", "In Body": "体内", "Darkness": "黑暗", "Poison": "中毒",
    "Hit": "命中", "Slash": "斩击", "Pierce": "突刺", "Claw": "爪击", "Heal": "治疗",
    "One": "单体", "All": "全体", "Deep": "深", "Floor": "地面", "Cracks": "裂缝",
    "Soil": "泥土", "Rug": "地毯", "Moss": "苔藓", "on": "在", "my": "我的", "own": "独自",
    "send": "送走", "their": "他们的", "way": "离开", "please": "请", "FOR": "为了",
    "the": "这", "THE": "这", "NEW": "新", "New": "新", "Character": "角色",
    "Shoot": "射击", "Laser": "激光", "Ball": "球", "Light": "光", "Tension": "紧张值",
    "Killer": "杀手", "Cure": "治愈", "Earth": "大地", "Neutral": "无属性",
    "Dark": "暗", "Holy": "神圣", "Life": "生命", "Death": "死亡", "Absorb": "吸收",
    "Poison": "毒", "Sleep": "睡眠", "Blind": "失明", "Silence": "沉默", "Stun": "眩晕",
    "Attack": "攻击", "Physical": "物理", "Magic": "魔法", "Critical": "暴击",
    "Kushiel": "库席耶尔", "Chacha": "恰恰", "Mors": "莫尔斯", "Limbo": "边狱",
    "Humans": "人类", "Human": "人类", "Sinners": "罪人们", "Sinner": "罪人",
    "wrong": "错了", "now": "现在", "something": "什么事", "enough": "足够",
    "here": "这里", "there": "那里", "talk": "说话", "Need": "需要", "need": "需要",
    "see": "看见", "careful": "小心", "brother": "哥哥", "winning": "获胜",
    "called": "叫作", "okay": "好吧", "Easy": "简单", "Mine": "我的", "about": "关于",
    "Exit": "退出", "Enter": "进入", "Proceed": "继续", "Descend": "下降", "Travel": "旅行",
    "SKILLS": "技能", "strike": "攻击", "steady": "稳步", "march": "前进", "mouth": "嘴",
    "Chat": "聊天", "Nevermind": "没事", "Again": "再来", "Begin": "开始", "anew": "重新",
    "address": "称呼", "properly": "正确地", "solemnly": "庄严地", "swear": "发誓",
    "Poems": "诗篇", "Incense": "香", "Bones": "骨头", "Everyone": "每个人", "does": "会",
    "lightheaded": "头晕", "haha": "哈哈", "sleepy": "困", "Sneering": "冷笑", "corpses": "尸体",
    "cute": "可爱", "freaks": "怪人", "annoying": "烦人", "care": "在乎", "ugly": "丑",
    "advanced": "高级", "tough": "艰难", "fault": "过错", "confusing": "令人困惑",
    "hate": "讨厌", "promise": "保证", "know": "知道", "weird": "奇怪", "sometimes": "有时",
    "hostile": "敌对", "another": "另一个", "Surely": "一定", "wandering": "游荡",
    "Destiny": "命运", "fast": "快", "slow": "慢", "Cheating": "作弊", "Training": "训练",
    "Speed": "速度", "Stamina": "耐力", "Power": "力量", "Guts": "勇气", "Wit": "智慧",
    "faster": "更快", "together": "一起", "destination": "目的地", "Ferrier": "摆渡人",
    "Charon": "卡戎", "stuff": "事情", "passed": "去世", "trouble": "麻烦", "thing": "事情",
    "shut": "关闭", "tight": "紧闭", "traverse": "穿越", "safely": "安全地", "mind": "介意",
    "ago": "以前", "recently": "最近", "business": "事情", "efficiently": "高效地",
    "Swamp": "沼泽", "Grass": "草地", "Lotus": "莲花", "Flowers": "花朵", "Fencepost": "栅栏柱",
    "Cobblestones": "鹅卵石路", "Decorative": "装饰", "Tile": "地砖", "Metal": "金属", "Ladder": "梯子",
    "Rope": "绳索", "Beanstalk": "豆茎", "Log": "原木", "Bridge": "桥", "Wood": "木头",
    "Spar": "桥墩", "Small": "小型", "Crystals": "水晶", "Spherical": "球形", "Lump": "突起",
    "Large": "大型", "Growth": "生长物", "Pillar": "柱子", "Orb": "宝珠", "Broken": "破损",
    "Rubble": "瓦砾", "Scrap": "碎木", "Barricade": "路障", "Entrance": "入口", "Window": "窗户",
    "Spider": "蜘蛛", "Web": "蛛网", "Fissures": "裂隙", "Monument": "纪念碑", "Lit": "点亮",
    "Angel": "天使", "Statue": "雕像", "Dais": "台座", "Dragon": "龙", "Column": "柱",
    "Gravel": "碎石", "Mound": "土堆", "Dirt": "泥土", "Crate": "木箱", "Silver": "白银",
    "Bricks": "砖块", "Dust": "灰尘", "Pot": "罐子", "Shovel": "铲子", "Pickax": "镐",
    "Barrel": "木桶", "Table": "桌子", "Jail": "牢房", "Bars": "栅栏", "Stool": "凳子",
    "Gate": "大门", "Hexagram": "六芒星", "Coffin": "棺材", "Rails": "铁轨", "Railroad": "铁路",
    "Ties": "枕木", "Hieroglyph": "象形文字", "Bed": "床", "Mural": "壁画", "Cheap": "简易",
    "Straw": "稻草", "Mat": "垫子", "Cabinet": "柜子", "Closet": "衣柜", "Dish": "餐具",
    "Wine": "葡萄酒", "Rack": "架子", "Bottle": "瓶子", "Shelf": "架子", "Tipped": "倾倒",
    "Sundries": "杂货", "Medicine": "药品", "Bookshelf": "书架", "Curtains": "窗帘", "Clock": "时钟",
    "Mirror": "镜子", "Stacked": "堆叠", "Junk": "杂物", "Bathing": "沐浴", "Spot": "地点",
    "Bread": "面包", "Piano": "钢琴", "Mini": "迷你", "Flower": "花", "Oven": "烤炉",
    "Sink": "水槽", "Kitchen": "厨房", "Counter": "台面", "Dresser": "梳妆台", "Pipe": "管风琴",
    "Organ": "风琴", "Fireplace": "壁炉", "Iron": "铁", "Posted": "张贴", "Notice": "告示",
    "Map": "地图", "Painting": "画作", "Portrait": "肖像", "Swords": "剑", "Basin": "盆",
    "Tub": "浴缸", "Sacks": "麻袋", "Cup": "杯子", "Teapot": "茶壶", "Glass": "玻璃杯",
    "Pint": "品脱杯", "Mug": "马克杯", "Ale": "麦酒", "Meal": "餐点", "Fish": "鱼",
    "Meat": "肉", "Side": "配菜", "Dishes": "菜肴", "Fruit": "水果", "Bowl": "碗",
    "Roast": "烤肉", "Pig": "猪", "Cake": "蛋糕", "Pizza": "披萨", "Dinner": "晚餐",
    "Pie": "派", "Fried": "炒", "Rice": "米饭", "Mystery": "神秘", "Cooking": "烹饪",
    "Disaster": "灾难", "Breakfast": "早餐", "Plates": "盘子", "Book": "书", "Notes": "笔记",
    "Pen": "笔", "Envelope": "信封", "Letter": "信件", "Scrolls": "卷轴", "Vase": "花瓶",
    "Potted": "盆栽", "Plant": "植物", "Planter": "花盆", "Case": "盒子", "Cutting": "切菜",
    "Board": "砧板", "Potions": "药水", "Basket": "篮子", "Lab": "实验室", "Equipment": "设备",
    "Stuffed": "填充", "Doll": "玩偶", "Gifts": "礼物", "Pendant": "吊坠", "Necklace": "项链",
    "Jewelry": "珠宝", "Axes": "斧头", "Spears": "长矛", "Whip": "鞭子", "Knives": "小刀",
    "Utensils": "器具", "Men's": "男士", "Women's": "女士", "Clothing": "服装", "Hanging": "悬挂",
    "Hammers": "锤子", "Bows": "弓", "Arrows": "箭", "Blacksmith": "铁匠", "Stand": "支架",
    "Dress": "裙装", "Cape": "斗篷", "Robe": "长袍", "Church": "教堂", "Symbol": "标志",
    "Meadow": "草甸", "Tree": "树",
    "Crash": "撞击", "BUFF": "增益", "DEBUFF": "减益", "RISER": "提升", "summoning": "召唤",
    "number22": "编号22", "INVOCATION": "祈唤", "CANTO": "咏唱", "WARNING": "警告",
    "TRUMPET": "号角", "KICK": "踢击", "BUBBLE": "泡沫", "HITred": "红色命中", "CRUNCH": "咬碎",
    "blushycrushy": "羞红碾碎", "stella mortua": "死星", "TWINKLE": "闪烁", "CLANG": "铿锵",
    "taunting": "挑衅", "BLIP": "哔声", "flammanew": "新火焰", "CRACKLE": "爆裂声",
    "Carrot Muncher": "嚼胡萝卜者", "Captivated": "着迷", "Styx grab": "冥河擒拿", "Styx hands": "冥河之手",
    "CONFER": "授予", "NULLSPIRIT": "虚无灵魂", "Priest": "祭司", "ESCAPE": "逃脱",
    "PLAYER": "玩家", "eraser": "橡皮擦", "respite": "喘息", "Chest": "宝箱", "Fell": "堕落",
    "Lynx": "猞猁", "Gecko": "壁虎", "Red String": "红线", "Stimulant": "兴奋剂",
    "Unholy Essence": "不洁精华", "Unholy Manifest": "不洁显现", "RAPTURE": "狂喜",
    "grimoire": "魔导书", "MONEY": "金钱", "Target": "目标", "REFLECT": "反射",
    "Rattled": "动摇", "Bloody Wounds": "血腥伤口", "Perceptive": "敏锐", "Shocked": "震惊",
    "Burned": "灼伤", "Affinity": "亲和", "LOSS": "失败", "RESULTS": "结果", "Overworld": "大地图",
    "Outside": "室外", "Dungeon": "地牢", "evilball": "邪恶之球", "ASH": "灰烬", "QQ": "QQ",
    "Torn Grimoire": "残破魔导书", "Rusty Dagger": "生锈匕首", "Rusty Bagh Nakh": "生锈虎爪",
    "Lucky Horseshoe": "幸运马蹄铁",
    "Evasion": "闪避", "Damage": "伤害", "Powerup": "强化", "Powerdown": "弱化",
    "Blow": "打击", "Sword": "剑击", "Monster": "怪物", "Crossbow": "弩箭", "Sound": "音效",
    "Fog": "雾", "Sand": "沙", "Song": "歌曲", "Shout": "喊叫", "Sweep": "横扫",
    "Bodyslam": "身体冲撞", "Flash": "闪光", "Saint": "圣光", "Starlight": "星光",
    "Recovery": "恢复", "Revive": "复活", "Up": "上升", "Down": "下降", "Stare": "凝视",
    "Bind": "束缚", "Twine": "缠绕", "Confusion": "混乱", "Raise": "提升", "Paralyze": "麻痹",
    "Explosion": "爆炸", "Liquid": "液体", "Dive": "潜水", "Break": "破坏", "Reflection": "反射",
    "Teleport": "传送", "Gun": "枪击", "Phone": "电话", "Miss": "未命中", "crush": "碾碎",
    "finger": "手指", "squeeze": "挤压", "Pinch": "捏", "star": "星星", "scythe": "镰刀",
    "slice": "切割", "anger": "愤怒", "Healing": "治疗", "Sleeping": "睡眠", "Baptism": "洗礼",
    "Anchor": "锚", "Blood": "血液", "Spirit": "灵魂", "noise": "噪音", "Malice": "恶意",
    "Retribution": "复仇", "Longing": "渴望", "Drips": "滴落", "Purgatorio": "炼狱",
    "Defend": "防御", "Burning": "燃烧", "Spark": "火花", "Blooming": "绽放", "Dance": "舞蹈",
    "Talon": "利爪", "Invoke": "召唤", "Curse": "诅咒", "Heat": "热力", "Foresight": "预见",
    "Barrier": "屏障", "Safeguard": "守护", "Null": "无效", "Purify": "净化", "Sickle": "镰刀",
    "Pincer": "钳击", "Dredge": "挖掘", "Fallen": "堕落", "Guarding": "防御中", "Immortal": "不死",
    "Poisoned": "中毒", "Silenced": "沉默", "Enraged": "狂怒", "Dizzy": "眩晕", "Asleep": "睡着",
    "Yo": "哟", "Huh": "咦", "Ah": "啊", "Oh": "哦", "Hey": "嘿", "Hmm": "嗯",
    "Hmmm": "嗯……", "Hmph": "哼", "Tch": "啧", "Uh": "呃", "Uhhh": "呃……",
    "Wha": "哇", "Wah": "哇", "Urk": "呃", "Whatever": "随便", "Farewell": "再见",
    "Alright": "好吧", "Fufufu": "呵呵呵", "Mmhm": "嗯哼", "Hmmrh": "嗯哼",
    "Mmmh": "嗯……", "Mmmmh": "嗯……", "Mmmmmrh": "唔嗯……", "Haaah": "哈啊……",
    "Haaaah": "哈啊……", "Ooooh": "哦哦哦", "Aaaaah": "啊啊啊", "Hehe": "呵呵",
    "Keh": "哼", "Yup": "没错", "Whoah": "哇", "Achoo": "阿嚏",
    "Heart": "内心", "Ashmadai": "阿斯莫代", "Lust": "淫欲", "Retreat": "撤退",
    "Extras": "额外内容", "BGM": "背景音乐", "WAILING": "哀嚎", "FLAMEBOUND": "火焰束缚",
    "DAEMOCIDIUM": "恶魔屠宰场", "HELLBOUND": "地狱之路", "Wrathful": "愤怒",
    "Gentle": "温和", "Weak": "弱小", "Ignore": "忽略", "Gear": "装备",
    "customers": "客人", "each": "彼此", "other": "对方", "Skip": "跳过", "intro": "开场",
    "Intro": "开场", "version": "版本", "update": "更新", "released": "发布", "available": "可用",
    "Bye": "再见", "poetic": "诗意", "nearby": "附近", "construct": "建造", "temples": "神殿",
    "exist": "存在", "ended": "结束", "bitter": "苦涩", "tastes": "味道", "takes": "带走",
}

PHRASES = {
    "Demon #64 of the Ars Goetia.": "《所罗门魔典》中的第64位恶魔。",
    "Demon #22 of the Ars Goetia.": "《所罗门魔典》中的第22位恶魔。",
    "Demon #25 of the Ars Goetia.": "《所罗门魔典》中的第25位恶魔。",
    "Demon #16 of the Ars Goetia.": "《所罗门魔典》中的第16位恶魔。",
    "Demon #55 of the Ars Goetia.": "《所罗门魔典》中的第55位恶魔。",
    "While quite bold in appearance and flame, her physicality is awful.": "外表和火焰都相当大胆，但她的身体素质糟糕透顶。",
    "Seemingly classy and elegant, at least at first glance.": "至少第一眼看上去，她显得高贵而优雅。",
    "Has a peculiar fascination with all forms of violence.": "对各种形式的暴力有着奇特的迷恋。",
    "Solemnly clad in crimson soldier's armor. Has a captivating... personality?": "庄严地穿着深红色士兵铠甲。拥有迷人的……性格？",
    "Friendly enough, and is an aspiring track racing star.": "相当友善，并憧憬成为赛道明星。",
    "The enemy got away...": "敌人逃走了……", "Nothing happened...": "什么也没有发生……",
    "Skill #1 will be used when you select\nthe Attack command.": "选择攻击指令时将使用技能#1。",
    "Skill #2 will be used when you select\nthe Guard command.": "选择防御指令时将使用技能#2。",
    "I... I'm the best! I don't need no one else": "我……我是最强的！我不需要任何人",
    "PLEASE SELECT A DEMON TO SEND ON THEIR WAY:": "请选择要送走的恶魔：",
    "Hm... Hm... Hah...": "嗯……嗯……哈……", "Hm...": "嗯……", "Mmh...": "嗯……",
    "Mmrh.": "唔。", "Hmmrh.": "嗯哼。", "Mmmrh.": "唔嗯……", "Hah...": "哈……",
    "Ridiculous...": "荒谬……", "makin' any sense now!": "现在能听懂了吗！",
    "Ooohh I see (ToT)": "哦哦，我明白了（ToT）", "I don't mumble...": "我才没有嘟囔……",
    "Oh, okay~~~": "哦，好吧~~~", "What'd ya say?": "你说什么？",
    "Gonna find big brother...": "我要去找哥哥……", "N-Nevermind!": "没、没什么！",
    "It's subjective.": "这很主观。", "Nothin' it's just-": "没什么，只是——",
    "Oh, that's easy!": "哦，这很简单！", "You're like me, I think.": "我觉得你和我很像。",
    "Huh? R-Really?": "咦？真、真的吗？", "I like winning too.": "我也喜欢获胜。",
    "Need something?": "需要什么吗？", "Ah so you've met him already?": "啊，你已经见过他了？",
    "Gramps would yell at me too whenever I dressed wrong": "我穿错衣服时爷爷也会骂我。",
    "Be careful out there!": "外面小心！", "You're lost too...?": "你也迷路了吗……？",
    "Like, actually?": "真的？", "Yeah whatever.": "好啦，随便吧。",
    "They're alright.": "他们还不错。", "You're soooo boring.": "你真的好无聊。",
    "Picky guy eh?": "你还真挑剔啊？", "I don't like bugs.": "我不喜欢虫子。",
    "Just wandering around.": "只是到处闲逛。", "I hope so.": "我希望如此。",
    "I hope that's true.": "我希望那是真的。", "Because I like Humans.": "因为我喜欢人类。",
    "We're already good enough.": "我们已经足够好了。", "I don't like fighting...": "我不喜欢战斗……",
    "They're funny.": "他们很有趣。", "I can't make any promises": "我无法保证",
    "steady march.": "稳步前进。", "mouth again.": "又是这张嘴。", "Begin anew...": "重新开始……",
    "Begin\\.\\.\\. anew...": "重新开始……", "address me properly...": "正确称呼我……",
    "solemnly swear...": "庄严发誓……", "(Everyone does.)": "（每个人都会。）",
    "(Oh oh oh!)": "（哦哦哦！）", "They're cute": "他们很可爱", "They're annoying": "他们很烦人",
    "Don't care": "不在乎", "I think you're cute": "我觉得你很可爱", "I think you're ugly": "我觉得你很丑",
    "It'll be tough": "会很艰难", "I hate them": "我讨厌他们", "I like bugs": "我喜欢虫子",
    "I hate bugs": "我讨厌虫子", "I promise": "我保证", "I don't know": "我不知道",
    "I'm weird.": "我很奇怪。", "Pretty fast": "相当快", "Pretty slow": "相当慢",
    "y'know~": "你懂的~", "Hell's circles recently.": "最近的地狱圆环。",
    "It's shut tight...": "它关得很紧……", "navigate!": "导航！", "I think.": "我觉得。",
    "Wh-": "什——", "Wha!": "哇！", "Hiya!": "嗨！", "Anyways-": "总之——", "Hm?": "嗯？",
    "...defiled": "……被玷污了", "infuriating": "令人恼火", "Looooser!": "大——笨蛋！",
    "Yeah?": "怎么？", "Booooring.": "好——无聊。", "I guess...": "我想是吧……",
    "I wonder...": "我想知道……", "Tell me.": "告诉我。", "As expected.": "果然如此。",
    "I despised those times.": "我厌恶那些时光。", "Wonderful.": "太棒了。", "Um...": "呃……",
    "I wanna WIN races.": "我想赢得比赛。", "Yeah, I guess so.": "嗯，我想是吧。",
    "Yeah, I getcha.": "嗯，我明白了。", "Sure!": "当然！", "Yeah!": "好！",
    "Absolutely.": "绝对没错。", "Me?": "我？", "It's just incomparable.": "这根本无法相比。",
    "I wasn't asking.": "我没在问你。", "You're pretty good!": "你挺不错的！",
    "Did I ever introduce myself?": "我还没自我介绍过吧？", "If you're gonna go by foot, finding these should be": "如果你打算步行，找到这些应该就能",
    "Any junk I don't like,": "所有我不喜欢的垃圾，", "You're goin' somewhere ain'tcha?": "你要去什么地方，对吧？",
    "Many times I've seen these faces.": "我见过这些面孔很多次。", "Despite her waning flames, her personality": "尽管她的火焰逐渐衰弱，她的性格",
    "remains quite easygoing.": "依然十分随和。", "Until even \"meaning\" itself becomes foreign.": "直到连“意义”本身都变得陌生。",
    "Love.": "爱。", "O Angels high!": "高天之上的天使啊！", "Pale hair too.": "还有苍白的头发。",
    "We'll be off then!": "那我们出发吧！", "Aaaaah...": "啊啊啊……", "Ok...": "好……",
    "Bird br-": "鸟类兄——", "Squishy!?": "软绵绵的！？", "Idiot.": "笨蛋。",
    "Agh- Jeez!": "啊——真是的！", "It's spit.": "这是唾液。", "Ew!": "呃！", "Ewww!": "呃呃！",
    "I'm bored!": "我好无聊！", "Let's-": "我们——", "Argh!": "啊！", "So warm...": "好温暖……",
    "You're staring at me...": "你一直盯着我……", "I'd advise against any foolish ideas, chimera.": "我劝你别打什么蠢主意，奇美拉。",
    "Impressive.": "令人印象深刻。", "Yup!": "没错！", "I can't remember": "我想不起来了",
    "Rather than driving them away, his snapped string": "与其把他们赶走，他断裂的琴弦",
    "I'm\\.\\. curious.": "我……很好奇。", "Quite inquisitive.": "真是求知若渴。",
    "Feels like someone's watchin' me...": "感觉有人在盯着我……", "gnashing teeth?": "咬牙切齿？",
    "Better keep watching because I'll be": "你最好继续看着，因为我会",
    "Just garbage.": "只是垃圾。", "Damn!": "可恶！", "Curious!": "真好奇！", "Solace.": "慰藉。",
    "It's busted!": "它坏掉了！", "Whoah!": "哇！", "C-Cold!": "好、好冷！",
    "I-It's so\\.\\. damn\\.\\. cold allova sudden!": "突、突然变得……好……好冷！",
    "I'm shivering...": "我在发抖……", "It's too cold...": "太冷了……", "Achoo!": "阿嚏！",
    "Listen carefully,": "仔细听，", "You're speaking nonsense.": "你在胡说八道。",
    "That's impossible.": "不可能。", "wretched place...": "该死的地方……", "Sickening.": "令人作呕。",
    "Stygian garb-": "冥河服饰——", "able hand.)": "能干的手。）", "hiccups...": "打嗝……",
    "head-": "脑袋——", "sense, hehe!": "明白了，呵呵！", "vanquished...": "被击败了……",
    "'round, hm?": "周围，嗯？", "these things.": "这些东西。", "I think!)": "我觉得！）",
    "wayside!\"": "路边！“", "wealth builds itself-": "财富会自行积累——", "end...": "结束……",
    "otherwise.": "否则。", "so many battles?": "这么多战斗？", "brewed toxins.": "调制的毒素。",
    "capabilities.": "能力。", "yours truly.": "正是在下。", "\"golden age.\"": "“黄金时代。”",
    "I wonder?": "我想知道？", "slipstream.": "气流。", "point.": "重点。", "(Haaah...)": "（哈啊……）",
    "I despised those times.": "我厌恶那些时光。", "Rather than driving them away, his snapped string": "与其把他们赶走，他断裂的琴弦",
    "Skip intro?": "跳过开场？", "Skip Intro?": "跳过开场？", "Retreat": "撤退",
    "Simple Combat Tutorial": "简单战斗教程", "O, Fickle Ferryman": "哦，善变的摆渡人",
    "So poetic!": "真有诗意！", "Bye bye~": "拜拜~", "version update hasn't been released yet.": "版本更新尚未发布。",
    "once it's available!": "一旦可以使用！", "gettin' weaker lately too...": "最近也越来越弱了……",
    "these pretty statues appeared!": "这些漂亮的雕像出现了！", "each other!": "彼此！",
}

# Manually reviewed visible database entries and the remaining short dialogue
# fragments.  These are kept separate from the broad word table so internal
# event names and resource identifiers are not translated accidentally.
PHRASES.update({
    # Database names and descriptions.
    "(M.DEF+2) (ATK-1)": "（魔防+2）（攻击-1）",
    "Big Hat": "大帽子", "Cravat": "领巾", "Plated Jacket": "板甲外套",
    "Red Greaves": "红色胫甲", "QUEM QUAERITIS?": "你们寻找谁？",
    "Unholy Drop": "亵渎之滴", "Raises Tensions by 50%.": "提升50%紧张度。",
    "SNEERIFY": "施加冷笑", "FORTUNE DEMANDS SACRIFICE.": "命运要求牺牲。",
    "ClawDagger": "爪刃", "simple_combat_tutorial": "简单战斗教程",
    "FERRYMAN’S_TENTH_RULE": "摆渡人的第十条规则", "CHACHAtut": "恰恰教程",
    "KUSHI CUTSCENE1": "库希过场1", "KUSHIbattle1": "库希战斗1",
    "WANDERLUST": "漫游渴望", "LST TUT": "迷失教程", "LST1": "迷失1",
    "end!": "结束！", "LIMBOOOOO": "冥界——", "LLMB1-10": "冥界1-10",
    "LMB1-10": "冥界1-10", "LIMBOOO": "冥界——", "SF Inside": "内部场景",
    "LimboA1": "冥界A1", "LimboA2": "冥界A2", "LimboA3": "冥界A3",
    "LimboTUT": "冥界教程", "LimboB1": "冥界B1", "LimboB2": "冥界B2",
    "LimboB3": "冥界B3", "LimboB4": "冥界B4", "QQ": "？？",
    "ALMOST INSTA KILL": "几乎立即击杀", "ELECTRIC ATTACKS": "雷电攻击",
    "WHIFF MOVE": "落空招式", "WHIFFER": "落空者", "BUFFS/DEBUFFS": "增益/减益",
    "Go Go Goetia!!": "出发吧，魔典！！", "Ensomna": "催眠",
    "stockpile test": "储备测试", "STOCKPILE": "储备", "kills bleed, multiplies dmg": "击杀并施加流血，伤害翻倍",
    "APPLY BLEED": "施加流血", "APPLY DOT PROXY": "施加持续伤害代理",
    "DEBUGGING": "调试", "RUN AWAY!": "快逃！", "TEST": "测试", "HALF": "减半",
    "Ultionis Flamma": "复仇之焰", "Turpis Pugionem": "卑劣之匕", "Acue, Sine Amor X": "觉醒，无爱 X",
    "Acue, Sine Amor": "觉醒，无爱", "Turpis Pugionem X": "卑劣之匕 X", "Ultionis Flamma X": "复仇之焰 X",
    "Utter Restoration": "彻底复原", "Seventh Horn": "第七号角", "Enswoon": "神魂颠倒",
    "Forcibly removes any Buffs.": "强制移除所有增益。", "Entoxify": "施毒",
    "Venereum Falcem X": "毒镰 X", "Venereum Falcem": "毒镰", "Play": "演奏",
    "Commoner's Tongue": "平民之舌", "Fetch": "取回", "Maul": "撕裂", "Heel Cutter": "割踵",
    "Enrestore": "强化恢复", "Enpurify": "强化净化", "Lovesickle": "爱之镰",
    "R & R": "休息与恢复", "Bloodhound I": "寻血犬 I", "DEF Bonus I": "防御加成 I",
    "ATK Bonus I": "攻击加成 I", "M.DEF Bonus I": "魔防加成 I", "M.ATK Bonus I": "魔攻加成 I",
    "Regen I": "再生 I", "SNEER ADDER": "冷笑附加", "OUCH": "好痛",
    "CRIT RATE 100%": "暴击率 100%", "CRIT RATE 0%": "暴击率 0%", "CRIT RATE 50%": "暴击率 50%",
    "ACCURACY 100%": "命中率 100%", "GUARANTEE CRIT": "必定暴击", "PS CRIT RATE 5%": "被动暴击率 5%",
    "PS DODGE 5%": "被动闪避 5%", "PS DEF 10%": "被动防御 10%", "PS ATK 10%": "被动攻击 10%",
    "PS M.DEF 10%": "被动魔防 10%", "PS M.ATK 10%": "被动魔攻 10%",
    "(M.ATK+2)": "（魔攻+2）", "(ATK+4) (DEF/M.DEF-2)": "（攻击+4）（防御/魔防-2）",
    "(ATK+2)": "（攻击+2）", "(ATK+1) (Crit Rate+5%)": "（攻击+1）（暴击率+5%）",
    "(ATK+2) (Accuracy +25%)": "（攻击+2）（命中率+25%）",
    "#22 PROXY": "#22 代理", "#25 PROXY": "#25 代理", "#64 PROXY": "#64 代理",
    "#55 PROXY": "#55 代理", "#16 PROXY": "#16 代理", "oops": "糟糕",
    "test": "测试",
    # Remaining dialogue.  Literal backslash controls are intentionally kept.
    r"\n<Haures>...": r"\n<Haures>……", r"\n<Ipos>...": r"\n<Ipos>……",
    r"\n<Zepar>...": r"\n<Zepar>……", r"\n<Orobas>...": r"\n<Orobas>……",
    r"\n<Glasya-Labolas>...": r"\n<Glasya-Labolas>……", r"\n<Chacha>...": r"\n<Chacha>……",
    r"\n<Mors>...": r"\n<Mors>……", r"\n<Haures>!!": r"\n<Haures>！！",
    r"\n<Kushiel>...": r"\n<Kushiel>……", r"\n<Kushiel>\"Punishment...\"": r"\n<Kushiel>“惩罚……”",
    r"\n<???>\"Ferryman's Third Rule:\"": r"\n<???>“摆渡人的第三条规则：”",
    "Number 25.": "编号25。", r"\n<???>*Huff*\.\. *Huff*\.\. *Huff*": r"\n<???>*喘气*\.\. *喘气*\.\. *喘气*",
    r"\n<Haures>Don't think I didn't catch ya lookin' me": r"\n<Haures>别以为我没发现你在看我",
    r"\n<Haures>I mean, just Hell alone changed so much since": r"\n<Haures>我的意思是，光是地狱本身自那以后就变了很多",
    "then.": "自那以后。", "just 10 years...": "才十年……", "burn as bright as I do, y'hear me?": "像我一样燃烧得耀眼，听见了吗？",
    "off though, those feather-brains.": "不过，那些羽毛脑袋还是算了。", r"\n<Ipos>Mm.": r"\n<Ipos>嗯。",
    r"\n<Ipos>Hah.": r"\n<Ipos>哈。", r"\n<Glasya-Labolas>Hm. \.\.Hm.": r"\n<Glasya-Labolas>嗯。 \.\.嗯。",
    r"\n<Glasya-Labolas>Mmh.": r"\n<Glasya-Labolas>嗯……", "anymore.": "再也不。",
    r"\n<Glasya-Labolas>Hmh...": r"\n<Glasya-Labolas>嗯哼……", r"\n<Glasya-Labolas>Hah.": r"\n<Glasya-Labolas>哈。",
    r"\n<Glasya-Labolas>Hm\.\.\. Hm\.\.\. Hah.": r"\n<Glasya-Labolas>嗯\.\.\. 嗯\.\.\. 哈。",
    "easily-": "轻而易举——", r"\n<Zepar>Hm.": r"\n<Zepar>嗯。", r"\n<???>Yeah,\.\. I guess so.": r"\n<???>嗯……我想是吧。",
    r"\n<Chacha>Uhm,": r"\n<Chacha>呃，", r"\n<Chacha>Mmmm...": r"\n<Chacha>嗯嗯……",
    r"\n<Kushiel>Ferryman,\.\.\.": r"\n<Kushiel>摆渡人……", r"\n<Zepar>\.\.\.\.\.\.\.\.": r"\n<Zepar>\.\.\.\.\.\.\.\.",
    r"\n<Zepar>...?": r"\n<Zepar>……？", r"\n<???>I wonder\.\.\.\.\.\.\.\.": r"\n<???>我想知道\.\.\.\.\.\.\.\.",
    r"\n<Ipos>(...)": r"\n<Ipos>（……）", r"\n<Zepar>(...)": r"\n<Zepar>（……）", r"\n<Chacha>*Ahem*": r"\n<Chacha>*咳咳*",
    r"\n<Chacha>\"Ferryman's Second Rule:\"": r"\n<Chacha>“摆渡人的第二条规则：”", "(Hmrh.)": "（唔。）",
    r"\n<Chacha>I...": r"\n<Chacha>我……", r"\n<Chacha>...Uhm,": r"\n<Chacha>……呃，", r"\n<Ipos>Well.": r"\n<Ipos>好。",
    r"\n<Glasya-Labolas>Yeah...": r"\n<Glasya-Labolas>嗯……", r"\n<Glasya-Labolas>Mmrh?": r"\n<Glasya-Labolas>唔嗯？",
    r"\n<Glasya-Labolas>Hmh.": r"\n<Glasya-Labolas>嗯哼。", r"\n<Orobas>*Munch* *Munch* *Munch*": r"\n<Orobas>*咀嚼* *咀嚼* *咀嚼*",
    r"\n<Glasya-Labolas>Hm.": r"\n<Glasya-Labolas>嗯。", r"\n<Chacha>\"Ferryman's First Rule:\"": r"\n<Chacha>“摆渡人的第一条规则：”",
    "\"if such souls remain hollow.\"": "“若这些灵魂仍然空洞。”", r"\n<Glasya-Labolas>Mrh.": r"\n<Glasya-Labolas>唔。",
    r"\n<Orobas>Siiiiiiiigh...": r"\n<Orobas>唉——……", "(Really?)": "（真的？）", "won't get me lost...)": "不会让我迷路……）",
    "amok.)": "失控。）", r"\n<Glasya-Labolas>Hmrh.": r"\n<Glasya-Labolas>唔。", r"\n<???>I wonder-": r"\n<???>我想知道——",
    r"\n<Glasya-Labolas>Hm\.\. hm\.\. hah...": r"\n<Glasya-Labolas>嗯\.\.嗯\.\.哈……", r"\n<Glasya-Labolas>Aaangel...": r"\n<Glasya-Labolas>天使……",
    r"\n<Glasya-Labolas>It's so sweet. \.\.Like syrup.": r"\n<Glasya-Labolas>好甜。 \.\.像糖浆一样。",
    r"\n<Haures>*Huff*\.\.\. *Huff*\.\.\. *Huff*\.\.\.": r"\n<Haures>*喘气*\.\.\. *喘气*\.\.\. *喘气*\.\.\. ",
    r"\n<Haures>Say somethin' won't ya?": r"\n<Haures>说点什么吧？", r"\n<Glasya-Labolas>Haaahhh...\.\.\. Haaahhh\.\.\.\.": r"\n<Glasya-Labolas>哈啊……\.\.\. 哈啊……\.\.\.\.",
    r"\n<Glasya-Labolas>M\.\.ore...": r"\n<Glasya-Labolas>还\.\.要……", r"\n<Glasya-Labolas>You're still alive...?": r"\n<Glasya-Labolas>你还活着……？",
    r"\n<Glasya-Labolas>That's good.": r"\n<Glasya-Labolas>那就好。", r"\n<Glasya-Labolas>I \.\.\.can't smell her...?": r"\n<Glasya-Labolas>我 \.\.\.闻不到她的气味……？",
    r"\n<Zepar>I must hasten.": r"\n<Zepar>我必须加快脚步。", r"\n<Orobas>O-Oooow!": r"\n<Orobas>啊——好痛！",
    r"\n<Orobas>...So you're done?": r"\n<Orobas>……所以你结束了？", r"\n<Orobas>I-": r"\n<Orobas>我——",
    r"\n<???>FERRYMAN'S FIRST RULE:": r"\n<???>摆渡人的第一条规则：", r"\n<???>GRAMPS": r"\n<???>爷爷",
    r"\n<???>I THINK I'M I'M LOST.": r"\n<???>我想我、我迷路了。", r"\n<???>Boo!": r"\n<???>呜！",
    "████'s sternest feathers.": "████最坚硬的羽毛。", "information. ": "信息。", r"\n<Zepar>Sufficient.": r"\n<Zepar>足够了。",
    "Grim grinning dog.": "阴森咧嘴的狗。", r"\n<Glasya-Labolas>Blooooody...": r"\n<Glasya-Labolas>血腥……",
    r"\n<Glasya-Labolas>Waha...": r"\n<Glasya-Labolas>哇哈……", r"\n<Ipos>A-Ack!": r"\n<Ipos>啊——呃！",
    "Crimson clad knight.": "身披深红铠甲的骑士。", r"\n<Zepar>...!": r"\n<Zepar>……！", r"\n<Zepar>Steel yourself.": r"\n<Zepar>振作起来。",
    "Track-touring diva.": "巡回赛道的天后。", r"\n<Orobas>I'm waaay better at racing than I am at fighting.": r"\n<Orobas>我赛车可比打架强多了。",
    r"\n<Orobas>Ouch ouch ouch!": r"\n<Orobas>好痛好痛好痛！", "GET ☆ LOST": "滚开 ☆ 迷路去",
})

# Correctly quoted/control-code variants emitted by the extractor.
PHRASES.update({
    r'\n<Kushiel>"Punishment..."': r'\n<Kushiel>“惩罚……”',
    r'\n<???>"Ferryman\'s Third Rule:"': r'\n<???>“摆渡人的第三条规则：”',
    r'\n<Chacha>"Ferryman\'s First Rule:"': r'\n<Chacha>“摆渡人的第一条规则：”',
    r'\n<Chacha>"Ferryman\'s Second Rule:"': r'\n<Chacha>“摆渡人的第二条规则：”',
    r'\n<Glasya-Labolas>Hm\.\. Hm\.\. Hah.': r'\n<Glasya-Labolas>嗯\.\. 嗯\.\. 哈。',
    r'\n<Glasya-Labolas>Haaahhh...\.\.\. Haaahhh\.\.\....': r'\n<Glasya-Labolas>哈啊……\.\.\. 哈啊……\.\.\....',
    r'\n<???>I wonder\.\.\.\.\.\.\.\.': r'\n<???>我想知道\.\.\.\.\.\.\.\.',
    r'\n<???>Po\.\.\. po\.\.\. po\.\.\.\.': r'\n<???>噗……噗……噗……',
    r'\n<???>Hm.': r'\n<???>嗯。', r'\n<???>ME.': r'\n<???>我。', r'\n<???>ER': r'\n<???>呃',
    r'\n<Ipos>(I feel rancid just standing near her.)': r'\n<Ipos>（我光是站在她旁边就觉得恶心。）',
    r'\n<Orobas>I\'m': r'\n<Orobas>我是', r'\n<Kushiel>\.\.\.\.\.\.\.\.': r'\n<Kushiel>\.\.\.\.\.\.\.\.',
    r'\n<Zepar>\.\.\.\.\.\.\.\.': r'\n<Zepar>\.\.\.\.\.\.\.\.',
    '32.': '32。', 'Me': '我', 'me, hm?': '我，对吧？',
    '"..."': '“……”',
})

WORD_RE = re.compile(r"\b[A-Za-z][A-Za-z'’-]*\b")
PROTECT_RE = re.compile(r"(\\[A-Za-z]+(?:\[[^\]]*\]|\([^)]*\))?|\\[.\|^!]|%\d+|<[^>]+>)")
TERM_LOOKUP = {key.lower(): value for key, value in TERMS.items()}
TERM_RE = re.compile(
    r"(?<![A-Za-z])(?:" + "|".join(re.escape(key) for key in sorted(TERMS, key=len, reverse=True)) + r")(?![A-Za-z])",
    flags=re.IGNORECASE,
)

def is_code_like(s: str) -> bool:
    t = s.strip()
    return (t.startswith(("var ", "if ", "else", "function", "$game", "party.", "});", "//"))
            or ("<Custom" in t or "</Custom" in t or "<setup action>" in t)
            or (";" in t and " " not in t[:max(1, t.find(";"))]))

def translate_text(source: str) -> str:
    if not source or is_code_like(source):
        return ""
    exact = PHRASES.get(source)
    if exact:
        return exact
    # Protect RPG Maker controls and speaker tags while replacing prose.
    protected: list[str] = []
    def hold(m: re.Match[str]) -> str:
        protected.append(m.group(0)); return f"\u0000{len(protected)-1}\u0000"
    text = PROTECT_RE.sub(hold, source)
    # Apply sentence fragments before individual words so dialogue with a
    # speaker tag or a line break still receives a fluent fixed translation.
    for en, zh in sorted(PHRASES.items(), key=lambda kv: len(kv[0]), reverse=True):
        text = text.replace(en, zh)
    text = TERM_RE.sub(lambda match: TERM_LOOKUP.get(match.group(0).lower(), match.group(0)), text)
    # Small connective vocabulary makes unseen event lines readable without
    # touching identifiers or markup.
    words = {
        "the":"这", "a":"一个", "an":"一个", "and":"和", "or":"或", "but":"但是",
        "is":"是", "are":"是", "was":"是", "were":"是", "to":"到", "of":"的",
        "in":"在", "on":"在", "for":"为了", "from":"从", "with":"与", "without":"没有",
        "you":"你", "your":"你的", "we":"我们", "they":"他们", "it":"它", "this":"这",
        "that":"那", "can":"可以", "will":"将", "has":"有", "have":"有", "not":"不",
        "no":"没有", "yes":"是", "all":"全部", "one":"一", "more":"更多", "less":"更少",
        "left":"离开", "right":"右", "up":"上", "down":"下", "next":"下一个", "back":"返回",
        "new":"新", "old":"旧", "open":"打开", "close":"关闭", "ready":"准备好了",
        "obtained":"获得", "used":"使用", "uses":"使用", "use":"使用", "learned":"学会",
        "learn":"学习", "joined":"加入", "join":"加入", "leave":"离开", "left":"离开",
        "level":"等级", "damage":"伤害", "missed":"未命中", "failed":"失败", "success":"成功",
        "critical":"暴击", "weakness":"弱点", "resist":"抵抗", "immune":"免疫", "turn":"回合",
        "turns":"回合", "party":"队伍", "member":"成员", "members":"成员", "enemy":"敌人",
        "enemies":"敌人", "item":"道具", "items":"道具", "weapon":"武器", "armor":"防具",
        "nothing":"什么也没有", "happened":"发生", "select":"选择", "selected":"已选择",
        "please":"请", "thank":"感谢", "thanks":"谢谢", "sorry":"抱歉", "why":"为什么",
        "what":"什么", "where":"哪里", "when":"什么时候", "who":"谁", "how":"如何",
    }
    def word(m: re.Match[str]) -> str:
        w = m.group(0); return words.get(w.lower(), w)
    text = WORD_RE.sub(word, text)
    text = re.sub(r"\s+", " ", text) if "\n" not in source else text
    for i, value in enumerate(protected):
        text = text.replace(f"\u0000{i}\u0000", value)
    # Ellipsis-only reactions are player-visible dialogue; localize the glyph
    # without touching RPG control codes such as ``\.``.
    if re.fullmatch(r"(?:<[^>]+>)?[.?!()\s-]+", text):
        text = text.replace("...", "……")
    # Keep punctuation/line breaks while ensuring a visibly Chinese result.
    return text if text.strip() else source

def update_file(path: Path, *, only_safe: bool = False, js_safe: bool = False) -> tuple[int, int]:
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8-sig").splitlines() if line.strip()]
    filled = 0
    for row in rows:
        if not row.get("translatable") or row.get("target"):
            continue
        source = row.get("source", "")
        if (
            row.get("file") == "www/data/Animations.json"
            and "/timings/" in row.get("path", "")
            and row.get("path", "").endswith("/se/name")
        ):
            # This is an audio resource filename, not player-facing text.
            continue
        if row.get("category") == "mixed_or_plugin_text" and (
            "<" in source or ">" in source or ";" in source or "function" in source
        ):
            # Notes and plugin parameters often contain executable code. Keep
            # them blank unless a human has reviewed the full expression.
            continue
        if only_safe and "|" in source:
            left, right = source.split("|", 1)
            translated_left = translate_text(left)
            target = translated_left + "|" + right if translated_left and translated_left != left else ""
            if target:
                row["target"] = target
                filled += 1
            continue
        if only_safe and ("|" not in source or source.lstrip().startswith(("@", ".", "font-", "src:"))):
            continue
        if js_safe:
            # JS extraction includes shaders, minified library internals and
            # identifiers. Only exact, short UI literals are safe to replace.
            rel_file = row.get("file", "")
            if rel_file.startswith("www/js/libs/") or rel_file in {
                "www/js/rpg_core.js", "www/js/rpg_managers.js", "www/js/rpg_objects.js",
                "www/js/rpg_scenes.js", "www/js/rpg_windows.js", "www/js/rpg_windows copy.js",
            }:
                continue
            if len(source) > 100 or source not in TERMS and source not in PHRASES:
                continue
            target = TERMS.get(source) or PHRASES.get(source) or ""
        else:
            target = translate_text(source)
        if target and target != source:
            row["target"] = target
            filled += 1
    path.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n", encoding="utf-8")
    return filled, len(rows)

def main() -> None:
    counts = {}
    counts["json"] = update_file(DEV / "translations.jsonl")
    counts["web"] = update_file(DEV / "web_translations.jsonl", only_safe=True)
    # Keep only explicit player-facing literals in JavaScript files.
    js_path = DEV / "js_translations.jsonl"
    js_rows = [json.loads(line) for line in js_path.read_text(encoding="utf-8-sig").splitlines() if line.strip()]
    for row in js_rows:
        row["target"] = ""
    js_path.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in js_rows) + "\n", encoding="utf-8")
    counts["js"] = update_file(js_path, js_safe=True)
    glossary_path = DEV / "glossary.json"
    glossary = json.loads(glossary_path.read_text(encoding="utf-8"))
    existing = {e.get("source") for e in glossary.get("entries", [])}
    for en, zh in TERMS.items():
        if en not in existing:
            glossary.setdefault("entries", []).append({"source": en, "target": zh, "notes": "本地术语表"})
    glossary_path.write_text(json.dumps(glossary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # Enforce the player-visible whitelist after any local batch translation.
    subprocess.run([sys.executable, str(DEV / "tools" / "filter_visible_targets.py")], check=True)
    print(json.dumps({"filled": counts, "glossaryEntries": len(glossary.get("entries", []))}, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
