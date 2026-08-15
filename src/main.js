import "./index.less";
import * as THREE from "three";
import VRHall from "./vrhall";
// import VRHall from "./lib/vrhall.es";
import { data } from "./pictures2";

// 因为模型所需，正常的gltf模型是不需要手动设置贴图的，这里是网上找的模型
import * as m from "./materls";

window.onload = function () {
  // 加载进度条
  const loader = document.createElement("div");
  loader.id = "loading-screen";
  loader.innerHTML = `
    <div class="loading-card">
      <div class="loading-title">正在加载展厅...</div>
      <div class="loading-bar"><div class="loading-bar-inner" id="loading-bar-inner"></div></div>
      <div class="loading-text" id="loading-text">准备中 0%</div>
    </div>`;
  document.body.appendChild(loader);

  const barInner = document.getElementById("loading-bar-inner");
  const barText = document.getElementById("loading-text");
  let loadedCount = 0;
  const totalSteps = 6; // 厅模型、贴图、展品、3只动物
  function updateProgress(step, label) {
    loadedCount++;
    const pct = Math.min(100, Math.round((loadedCount / totalSteps) * 100));
    barInner.style.width = pct + "%";
    barText.textContent = `${label} ${pct}%`;
  }

  // 实例化
  const vr = new VRHall({
    debugger: false, // 开启调试模式
    maxSize: 20, // 画框最大尺寸
    movieHight: 2, // 移动的高度
    container: document.getElementById("root"),
    cameraOption: {
      position: { x: 16.928, y: 2, z: 0.699 },
      lookAt: { x: 30.551, y: 2, z: 1.096 },
    },
    onClick: (item) => {
      console.log("你点击了", item);
      // 显示居中描述面板
      showInfoPanel(item);
    },
  });

  // 加载厅模型（最先加载）
  vr.loadHall({
    url: "./assets/room2/dm.glb",
    planeName: "dm",
    position: { x: 0, y: 0, z: 0 },
    scale: 1,
  }).then((gltf) => {
    updateProgress(1, "加载展厅模型");

    const dm_OBJ = gltf.scene.getObjectByName("dm");
    dm_OBJ.material = m.dm_M;
    const dm2_OBJ = gltf.scene.getObjectByName("dm2");
    dm2_OBJ.material = m.wall_M;
    const qiang5_OBJ = gltf.scene.getObjectByName("qiang5");
    qiang5_OBJ.material = m.qiang5_M;
    const huaqiang1_OBJ = gltf.scene.getObjectByName("huaqiang1");
    huaqiang1_OBJ.material = m.huaqiang1_M;
    const huaqiang3_OBJ = gltf.scene.getObjectByName("huaqiang3");
    huaqiang3_OBJ.material = m.huaqiang3_M;
    const huaqiang2_OBJ = gltf.scene.getObjectByName("huaqiang2");
    huaqiang2_OBJ.material = m.huaqiang2_M;
    const qiang2_OBJ = gltf.scene.getObjectByName("qiang2");
    qiang2_OBJ.material = m.qiang2_M;
    const qiang3_OBJ = gltf.scene.getObjectByName("qiang3");
    qiang3_OBJ.material = m.qiang3_M;
    const qiang1_OBJ = gltf.scene.getObjectByName("qiang1");
    qiang1_OBJ.material = m.qiang1_M;
    const men2_OBJ = gltf.scene.getObjectByName("men2");
    men2_OBJ.material = m.men2_M;
    const chuanghu_OBJ = gltf.scene.getObjectByName("chuanghu");
    chuanghu_OBJ.material = m.chuanghu_M;
    const dingtiao_OBJ = gltf.scene.getObjectByName("dingtiao");
    dingtiao_OBJ.material = m.dingtiao_M;
    const dingbian_OBJ = gltf.scene.getObjectByName("dingbian");
    dingbian_OBJ.material = m.dingbian_M;
    const dizuo1_OBJ = gltf.scene.getObjectByName("dizuo1");
    dizuo1_OBJ.material = m.dizuo1_M;
    const qiang4_OBJ = gltf.scene.getObjectByName("qiang4");
    qiang4_OBJ.material = m.qiang4_M;
    const cebaiqiang_OBJ = gltf.scene.getObjectByName("cebaiqiang");
    cebaiqiang_OBJ.material = m.ding_M;
    const boli1_OBJ = gltf.scene.getObjectByName("boli1");
    boli1_OBJ.material = m.boli1_M;
    const dimian2_OBJ = gltf.scene.getObjectByName("dimian2");
    dimian2_OBJ.material = m.dimian2_M;
    const dimian3_OBJ = gltf.scene.getObjectByName("dimian3");
    dimian3_OBJ.material = m.dimian3_M;
    const deng_OBJ = gltf.scene.getObjectByName("deng");
    deng_OBJ.material = m.deng_M;
    const ding_OBJ = gltf.scene.getObjectByName("ding");
    ding_OBJ.material = m.ding_M;
    const baiding_OBJ = gltf.scene.getObjectByName("baiding");
    baiding_OBJ.material = m.baiding_M;

    updateProgress(2, "设置墙面贴图");

    // 简介墙贴图（使用异步加载避免阻塞）
    new THREE.TextureLoader().load(
      "./assets/pictures2/main.jpg",
      (tex) => {
        const info3d = gltf.scene.getObjectByName("jianjieqiang");
        info3d.material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: tex,
        });
        updateProgress(3, "加载简介墙");
      }
    );

    // 加载展品数据（画框）
    vr.loadItems(data);
    updateProgress(4, "加载展品");

    // 等待一帧，保证场景已渲染出展厅，再加载动物模型
    requestAnimationFrame(() => {
      // 同时并行加载3只动物，但狗模型最大的最后加载
      Promise.all([
        // 1. 羊（334KB，小）
        vr.loadGLTF({
          scale: 0.1,
          position: {
            x:0.14009586306492472,y:1.072579028432172,z:3.3849787954383963
          },
          rotation: { x: 0, y: Math.PI / 2, z: 0 },
          autoLight: true,
          url: `./assets/robot/sheep.glb`,
        }).then((gltf) => {
          gltf.scene.odata = {
            id: "sheep",
            name: "一只丑丑的乖小羊",
            desc: "学名：乖小半。2022年2月27日出生于小白猪口袋。<br>补档礼包：芋泥啵啵和竹马一起刷起来：柏里挑怡，一见倾心！",
          };
          vr.addClickEvent(gltf.scene);
          vr.createAnimate(gltf, { animateIndex: 0, duration: 60 });
          updateProgress(5, "加载动物模型");
        }),

        // 2. 飞猪（977KB）
        vr.loadGLTF({
          url: "./assets/robot/fly_pig.glb",
          position: {
            x: 19.655541400079763,
            y: 0.3955837972716467,
            z: 3.3849787954383963,
          },
          rotation: { x: 0, y: -Math.PI / 2, z: 0 },
          scale: 0.4,
        }).then((gltf) => {
          gltf.scene.odata = {
            id: "pig",
            name: "一只小丑猪",
            desc: '学名：朱怡欣。1998年4月22日出生于浙江金华。<br>补档礼包：<a href="https://weibo.com/6219760128/5231569460791347" target="_blank" rel="noopener noreferrer">点击查看俺老猪传奇人生</a>',
          };
          vr.addClickEvent(gltf.scene);
          vr.createAnimate(gltf, { animateIndex: 0, duration: 5 });
        }),

        // 3. 狗模型最大（5.86MB），放在最后加载
        vr.loadGLTF({
          scale: 4,
          position: {
            x:-9.742667925899568,y:1.072579028432172,z:3.3849787954383945
          },
          rotation: { x:-1.5707963267948968,y:0.11470034394452681,z:1.5707963267948966 },
          url: `./assets/robot/dog.glb`,
        }).then((gltf) => {
          gltf.scene.odata = {
            id: "dog",
            name: "一只比丑小猪和丑小羊好一点的丑小狗",
            desc: '学名：柏欣妤。1997年1月25日出生于江苏盐城。<br>补档礼包：<a href="https://weibo.com/6387562987/4820881443127656" target="_blank" rel="noopener noreferrer">点击查看俺老狗传奇人生</a>',
          };
          vr.addClickEvent(gltf.scene);
          updateProgress(6, "加载完成");
          // 全部加载完毕，淡出进度条
          setTimeout(() => {
            loader.classList.add("fade-out");
            setTimeout(() => loader.remove(), 600);
          }, 400);
        }),
      ]);
    });
  });

  // 导览点
  let shtml = "";
  data.forEach((d) => {
    shtml += `<li class="item" data-id="${d.id}">展品:${d.id}</li>`;
  });
  shtml += `<li class="gravity">重力感应</li>`;

  document.querySelector(".view").innerHTML = shtml;

  document.querySelector(".gravity").addEventListener("click", () => {
    if (document.location.protocol === "https:") {
      vr.gravity.toggle();
    } else {
      alert("需要开启https");
    }
  });

  document.querySelectorAll(".item").forEach((target) => {
    target.addEventListener("click", () => {
      const id = target.dataset.id;
      vr.viewItem(id);
    });
  });

  // 右侧描述面板
  const infoPanel = document.getElementById("info-panel");
  const infoTitle = document.getElementById("info-title");
  const infoImage = document.getElementById("info-image");
  const infoDesc = document.getElementById("info-desc");
  const infoClose = document.getElementById("info-close");

  function showInfoPanel(item) {
    infoTitle.textContent = item.name || "展品详情";
    infoImage.innerHTML = item.url
      ? `<img src="${item.url}" alt="${item.name || ""}" />`
      : "";
    infoDesc.innerHTML = item.desc || "暂无描述";
    infoPanel.classList.add("active");
  }

  infoClose.addEventListener("click", () => {
    infoPanel.classList.remove("active");
  });

  // 点击遮罩区域关闭面板（点击卡片内部不关闭）
  infoPanel.addEventListener("click", (e) => {
    if (e.target === infoPanel) {
      infoPanel.classList.remove("active");
    }
  });
};
