#!/usr/bin/env python3
"""Translate tile-label left columns with a local, reviewed word list."""
from __future__ import annotations

import json
import re
from pathlib import Path

DEV = Path(__file__).resolve().parents[1]
WORD_RE = re.compile(r"[A-Za-z][A-Za-z'’-]*")

WORDS = {
    "wall":"墙", "snow":"雪", "ruins":"废墟", "large":"大型", "stairs":"楼梯", "castle":"城堡", "pillar":"柱子", "stone":"石头", "metal":"金属", "floor":"地板", "window":"窗户", "bridge":"桥", "wood":"木头", "dirt":"泥土", "roof":"屋顶", "tower":"塔", "tile":"地砖", "cave":"洞窟", "decorative":"装饰", "monument":"纪念碑", "ledge":"台阶", "demon":"恶魔", "round":"圆形", "left":"左", "outer":"外侧", "cobblestones":"鹅卵石", "statue":"雕像", "rock":"岩石", "right":"右", "center":"中央", "fort":"要塞", "interior":"内部", "shelf":"架子", "sign":"标牌", "shop":"商店", "broken":"破损", "banister":"扶手", "mountain":"山", "table":"桌子", "tree":"树", "ground":"地面", "hole":"洞", "curtains":"窗帘", "neon":"霓虹灯", "machine":"机器", "fissures":"裂缝", "bed":"床", "asphalt":"沥青", "brick":"砖", "relief":"浮雕", "rope":"绳子", "entrance":"入口", "building":"建筑", "grass":"草地", "top":"顶部", "meadow":"草甸", "ladder":"梯子", "spar":"横杆", "town":"城镇", "temple":"神殿", "middle":"中部", "factory":"工厂", "bottom":"底部", "mound":"土丘", "gate":"大门", "tent":"帐篷", "red":"红色", "ice":"冰", "crate":"木箱", "desert":"沙漠", "wire":"铁丝", "glass":"玻璃", "cliff":"悬崖", "lava":"熔岩", "down":"下", "tapestry":"挂毯", "throne":"王座", "huge":"巨大", "up":"上", "rails":"铁轨", "midsize":"中型", "lit":"点亮", "iron":"铁", "road":"道路", "fence":"栅栏", "gold":"金色", "gravel":"碎石", "hexagram":"六芒星", "clock":"时钟", "carpet":"地毯", "book":"书", "line":"线", "waterfall":"瀑布", "demonic":"恶魔的", "mesh":"网格", "concrete":"混凝土", "vines":"藤蔓", "rubble":"瓦砾", "jail":"牢房", "bottle":"瓶子", "fireplace":"壁炉", "board":"木板", "spire":"尖塔", "stalls":"摊位", "arch":"拱门", "maze":"迷宫", "crystal":"水晶", "chest":"宝箱", "plant":"植物", "decoration":"装饰", "white":"白色", "world":"世界", "bracing":"支撑", "angel":"天使", "dragon":"龙", "bookshelf":"书架", "stacked":"堆叠", "chair":"椅子", "stand":"架台", "cloud":"云", "mark":"标记", "school":"学校", "black":"黑色", "city":"城市", "floating":"浮空", "continent":"大陆", "water":"水域", "closed":"关闭", "indigo":"靛蓝", "fountain":"喷泉", "in":"内", "body":"主体", "moss":"苔藓", "silver":"银色", "stele":"石碑", "crater":"陨石坑", "front":"前方", "pipe":"管道", "bar":"横杆", "village":"村庄", "translucent":"半透明", "log":"原木", "tall":"高", "sundries":"杂物", "crates":"木箱", "open":"开放", "piano":"钢琴", "plate":"盘子", "conifer":"针叶树", "rust":"锈", "tube":"管", "sphere":"球体", "machinery":"机械", "food":"食物", "transparent":"透明", "dead":"枯死", "small":"小型", "boulder":"巨石", "stained":"彩绘", "church":"教堂", "house":"房屋", "connecting":"连接", "plumbing":"管线", "land":"土地", "tank":"坦克", "rooftop":"屋顶", "bars":"栅栏", "junk":"废品", "mansion":"大宅", "port":"港口", "field":"田地", "dirty":"肮脏", "patina":"铜绿", "barracks":"兵营", "convenience":"便利", "store":"商店", "car":"汽车", "rocky":"岩石", "sandstone":"砂岩", "flowers":"花朵", "marble":"大理石", "mine":"矿井", "bottles":"瓶子", "cup":"杯子", "mug":"马克杯", "doll":"玩偶", "forest":"森林", "girder":"梁", "desk":"书桌", "topside":"上侧", "collapsed":"坍塌", "walled":"有围墙的", "dark":"黑暗", "rug":"地毯", "barricade":"路障", "bricks":"砖块", "pot":"罐子", "bones":"骨头", "coffin":"棺材", "mural":"壁画", "drawers":"抽屉", "mirror":"镜子", "painting":"画作", "pint":"品脱", "set":"套装", "old":"旧", "railings":"栏杆", "bush":"灌木", "farm":"农田", "warning":"警告", "sofa":"沙发", "apartment":"公寓", "yellow":"黄色", "street":"街道", "bus":"公交车", "gutter":"排水沟", "railing":"栏杆", "fortress":"堡垒", "residence":"住宅", "entertainment":"娱乐", "district":"区域", "beanstalk":"豆茎", "exit":"出口", "light":"灯光", "dais":"台座", "barrel":"木桶", "stool":"凳子", "teapot":"茶壶", "ale":"麦酒", "armor":"铠甲", "paved":"铺装", "air":"空气", "steel":"钢铁", "signboard":"招牌", "to":"至", "the":"", "of":"的", "or":"或", "swamp":"沼泽", "lotus":"莲花", "pads":"叶片", "abandoned":"废弃", "half":"一半", "cheap":"廉价", "cabinet":"柜子", "dish":"餐盘", "rack":"架子", "flower":"花", "organ":"管风琴", "map":"地图", "swords":"剑", "basin":"脸盆", "box":"箱子", "stuffed":"填充", "clothing":"衣物", "goddess":"女神", "chimney":"烟囱", "streetlight":"街灯", "chinese":"中式", "pattern":"图案", "no":"无", "entry":"入口", "hospital":"医院", "roulette":"轮盘", "vent":"通风口", "waste":"废物", "belt":"传送带", "conveyor":"输送", "monitor":"监视器", "linoleum":"油毡", "stall":"摊位", "goods":"货物", "barbed":"带刺", "area":"区域", "station":"车站", "volcano":"火山", "slum":"贫民区", "warehouse":"仓库", "canal":"运河", "fencepost":"栅栏柱", "raised":"凸起", "frozen":"冻结", "scrap":"废料", "tablet":"平板", "straw":"稻草", "wine":"葡萄酒", "simple":"简单", "sacks":"麻袋", "case":"盒", "sword":"剑", "hanging":"悬挂", "sand":"沙", "detail":"细节", "frame":"框架", "document":"文件", "shipping":"运输", "container":"集装箱", "cardboard":"纸板", "control":"控制", "panel":"面板", "traffic":"交通", "digital":"数字", "signage":"标牌", "fuel":"燃料", "hill":"丘陵", "park":"公园", "software":"软件", "deep":"深", "poison":"毒", "darkness":"黑暗", "directional":"方向", "lump":"块", "hieroglyph":"象形文字", "closet":"壁橱", "tipped":"倾倒", "shield":"盾牌", "sack":"麻袋", "side":"侧面", "dinner":"晚餐", "breakfast":"早餐", "notes":"笔记", "pen":"笔", "potted":"盆栽", "basket":"篮子", "spears":"长矛", "helmet":"头盔", "repository":"储藏处", "grave":"坟墓", "fire":"火", "fallen":"倒下", "crops":"农作物", "palm":"棕榈", "checkered":"格纹", "podium":"讲台", "wheelchair":"轮椅", "device":"设备", "office":"办公室", "bathtub":"浴缸", "item":"物品", "locker":"储物柜", "display":"显示", "vending":"自动售货", "poker":"扑克", "cloth":"布", "partition":"隔断", "pile":"堆", "graffiti":"涂鸦", "operation":"操作", "cage":"笼子", "handrail":"扶手", "soldier":"士兵", "bumpy":"崎岖", "lights":"灯", "crane":"起重机", "truck":"卡车", "slide":"滑梯", "bench":"长椅", "helicopter":"直升机", "waiting":"候车", "grassland":"草原", "giant":"巨型", "magic":"魔法", "cursed":"诅咒", "residential":"住宅", "police":"警察", "museum":"博物馆", "construction":"施工", "site":"场地", "theme":"主题", "military":"军事", "base":"基地", "dome":"穹顶", "and":"和", "a":"", "from":"从", "on":"上", "with":"与", "without":"无", "men's":"男性", "women's":"女性", "western":"西式", "style":"风格", "toilet":"厕所", "urinal":"小便池", "refrigerator":"冰箱", "miscellaneous":"杂项", "operating":"操作", "mattress":"床垫", "slot":"老虎机", "skeleton":"骨骼", "model":"模型", "biological":"生物", "armchair":"扶手椅", "restroom":"洗手间", "chart":"图表", "outdoor":"室外", "intake":"进气", "unit":"单元", "shutter":"卷帘门", "mysterious":"神秘", "liquid":"液体", "mechanical":"机械", "robot":"机器人", "arm":"手臂", "server":"服务器", "meters":"仪表", "drain":"排水口", "iv":"静脉", "ecg":"心电图", "sewing":"缝纫", "mannequin":"人体模型", "ivy":"常春藤", "block":"方块", "weapon":"武器", "pharmacy":"药房", "cafe":"咖啡馆", "crosswalk":"人行横道", "poster":"海报", "casino":"赌场", "oil":"油", "drum":"桶", "garbage":"垃圾", "sorted":"分类", "bins":"垃圾箱", "utility":"公用", "pole":"电线杆", "tombstone":"墓碑", "wrecked":"损毁", "swing":"秋千", "canopy":"遮棚", "cart":"推车", "storage":"储藏", "kiosk":"售货亭", "land's":"大地的", "end":"尽头", "wasteland":"荒地", "clouds":"云层", "pier":"码头", "tunnel":"隧道", "shrine":"神社", "shadow":"阴影", "reservoir":"蓄水池", "coniferous":"针叶", "shopping":"购物", "complex":"综合体", "gantry":"龙门", "watchtower":"瞭望塔", "lighthouse":"灯塔", "cemetery":"墓地", "prison":"监狱", "the":"", "materials":"材料", "tool":"工具", "roadside":"路边", "avenue":"大道", "public":"公共", "phone":"电话", "loop":"环路", "cross":"十字", "plaque":"牌匾", "guardrail":"护栏", "timetable":"时刻表", "piled":"堆放", "tires":"轮胎", "manhole":"井盖", "leak":"泄漏", "exercise":"锻炼", "drinking":"饮水", "pump":"水泵", "dumpster":"垃圾箱", "postal":"邮政", "hydrant":"消防栓", "ceiling":"天花板", "shoal":"浅滩", "icebergs":"冰山", "bubbles":"气泡", "whirlpool":"漩涡", "endless":"无尽", "snowfield":"雪原", "oasis":"绿洲", "igloo":"冰屋", "pyramid":"金字塔", "avalanche":"雪崩", "blocked":"封锁", "trail":"小径", "barricades":"路障", "lookout":"瞭望", "post":"哨站", "hut":"小屋", "shanty":"棚屋", "windmill":"风车", "parabolic":"抛物线", "antenna":"天线", "heliport":"直升机坪", "broadleaf":"阔叶", "pan-dae-mon-ium":"潘德莫尼乌姆",
}

WORDS.update({
    "anatomical":"解剖", "artery":"血管", "bath":"浴池", "bathroom":"浴室", "beer":"啤酒", "billboard":"广告牌", "biohazard":"生物危害", "blacksmith's":"铁匠的", "blank":"空白", "blue":"蓝色", "bollard":"系缆柱", "books":"书籍", "boxes":"箱子", "bread":"面包", "bucket":"桶", "buildings":"建筑群", "bulletin":"公告", "can":"罐", "cape":"披风", "castle's":"城堡的", "chicken":"鸡肉", "coin":"硬币", "coins":"硬币", "conditioner":"空调", "cone":"锥桶", "counter":"柜台", "cracks":"裂纹", "crest":"徽章", "crumbling":"崩塌", "crystals":"水晶", "cutting":"切割", "detritus":"碎屑", "dishes":"餐具", "dress":"礼服", "dressed":"装饰", "dry":"干燥", "dug-up":"挖掘", "dust":"尘土", "eatery":"餐馆", "edging":"边缘", "exclamation":"感叹号", "exhaust":"排气", "extend":"延伸", "extinguisher":"灭火器", "fern":"蕨类", "firearm":"枪械", "firewood":"柴火", "fluorescent":"荧光", "fortuneteller's":"占卜师的", "garden":"花园", "gifts":"礼物", "green":"绿色", "grid":"网格", "growth":"生长物", "hammer":"锤子", "hat":"帽子", "hay":"干草", "hedge":"树篱", "icy":"冰冷", "inn":"旅馆", "intercom":"对讲机", "jars":"罐子", "jewelry":"珠宝", "keep":"城堡内堡", "khaki":"卡其色", "kitchen":"厨房", "leaves":"叶子", "letter":"信件", "lined":"衬边", "market":"市场", "mat":"垫子", "meat":"肉", "medicine":"药品", "men":"男性", "mini":"迷你", "mooring":"系泊", "mushrooms":"蘑菇", "necklace":"项链", "noodle":"面条", "notice":"告示", "off":"脱离", "orange":"橙色", "orb":"宝珠", "out":"外侧", "pedestrian":"行人", "picture":"图片", "pieces":"碎片", "pit":"坑洞", "planter":"花盆", "plaster":"灰泥", "pond":"池塘", "pool":"水池", "portrait":"肖像", "posted":"张贴", "potion":"药水", "pub":"酒馆", "radioactivity":"放射性", "railroad":"铁路", "resin":"树脂", "riight":"右侧", "robe":"长袍", "rocks":"岩石", "room":"房间", "roor":"屋顶", "rugs":"地毯", "scarecrow":"稻草人", "scrolls":"卷轴", "sea":"海", "sheet":"板材", "shrub":"灌木", "soil":"土壤", "speaker":"扬声器", "specimen":"标本", "spherical":"球形", "sprouts":"嫩芽", "stage":"舞台", "staves":"法杖", "stepping":"踏脚", "stones":"石块", "stump":"树桩", "susuki":"芒草", "symbol":"符号", "test":"测试", "thatch":"茅草", "ties":"枕木", "trees":"树木", "tub":"木盆", "urban":"都市", "vision":"视力", "walker":"行走者", "wash":"洗涤", "washing":"洗衣", "well":"水井", "women":"女性",
    "anatomical":"解剖", "bust":"胸像", "envelope":"信封", "fan":"风扇", "insect":"昆虫", "meal":"餐食", "mystery":"谜团", "roast":"烤肉", "sink":"水槽", "snowman":"雪人", "cactus":"仙人掌", "rafflesia":"大王花", "floral":"花卉", "patch":"花圃", "calendar":"日历", "canvas":"画布", "valve":"阀门", "scattered":"散落", "papers":"纸张", "duct":"管道", "emergency":"紧急", "alarm":"警报", "dripping":"滴落", "lamp":"灯", "altar":"祭坛", "ration":"口粮", "net":"网", "computer":"电脑", "laptop":"笔记本电脑", "printer":"打印机", "telephone":"电话", "gas":"燃气", "stove":"炉灶", "wastebasket":"废纸篓", "atm":"自动取款机", "tv":"电视", "pan-dae-mon-ium":"潘德莫尼乌姆", "fish":"鱼", "pig":"猪",
})

SPECIAL_LABELS = {"TV": "电视", "ATM": "自动取款机", "Net": "网络", "PAN-DAE-MON-IUM": "潘德莫尼乌姆"}


def translate_left(left: str) -> str:
    prefix = "\ufeff" if left.startswith("\ufeff") else ""
    body = left.lstrip("\ufeff")
    if body in SPECIAL_LABELS:
        return prefix + SPECIAL_LABELS[body]
    def repl(m: re.Match[str]) -> str:
        w = m.group(0)
        key = w.lower()
        if key in WORDS:
            return WORDS[key]
        if len(w) == 1 or w.isupper() or w.isdigit():
            return w
        return w
    return prefix + WORD_RE.sub(repl, body)


def main() -> None:
    path = DEV / "web_translations.jsonl"
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8-sig").splitlines() if line.strip()]
    filled = 0
    for row in rows:
        if row.get("target"):
            continue
        source = row.get("source", "")
        if "|" not in source:
            continue
        left, right = source.split("|", 1)
        translated = translate_left(left)
        if translated != left and translated.strip("\ufeff "):
            row["target"] = translated + "|" + right
            filled += 1
    path.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n", encoding="utf-8")
    print(json.dumps({"filled": filled, "rows": len(rows)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
