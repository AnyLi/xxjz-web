<template>
  <div class="group-img-page">
    <!-- 全屏加载效果 -->
    <div v-if="loading" class="full-loading">
      <div class="loading-spinner">
        <i class="el-icon-loading"></i>
        <p>正在加载图片...</p>
      </div>
    </div>

    <!-- 头部 -->
    <header class="mb-6">
      <div class="header-card">
        <BackHomeButton />
        <h1 class="header-title"><i class="el-icon-picture-outline"></i> 图片拼接工具</h1>
        <p class="header-subtitle">选择图片生成组合装效果图</p>
      </div>
    </header>

    <div class="space-y-5">
      <!-- 图片选择区域 -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">图片库</h2>
          <div class="btn-group">
            <button @click="selectAll" class="btn-secondary">
              <i class="el-icon-check"></i> 全选
            </button>
            <button @click="clearSelection" class="btn-secondary">
              <i class="el-icon-close"></i> 清空
            </button>
          </div>
        </div>

        <!-- 图片网格 -->
        <div class="image-grid">
          <div
            v-for="(image, index) in imageList"
            :key="index"
            class="image-card"
            :class="{ selected: selectedImages.includes(image) }"
            @click="toggleSelection(image)"
          >
            <img
              :src="image.imageUrl"
              :alt="image.alt"
              class="image-thumbnail"
            />
            <div v-if="selectedImages.includes(image)" class="check-badge">
              <i class="el-icon-check"></i>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <i class="el-icon-loading"></i>
          <p>正在加载图片...</p>
        </div>
      </div>

      <!-- 布局设置 -->
      <div class="card">
        <h3 class="card-title">布局设置</h3>
        <div class="settings-section">
          <label class="settings-label">网格列数</label>
          <div class="column-options">
            <button
              v-for="col in [2, 3, 4]"
              :key="col"
              @click="gridColumns = col"
              class="column-btn"
              :class="{ active: gridColumns === col }"
            >
              {{ col }}列
            </button>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="card">
        <h3 class="card-title">操作</h3>
        <div class="action-buttons">
          <button
            @click="generatePreview"
            :disabled="selectedImages.length === 0"
            class="btn-primary"
          >
            <i class="el-icon-view"></i> 生成预览
          </button>
          <button
            @click="capture"
            :disabled="!previewGenerated"
            class="btn-primary btn-save"
          >
            保存到本地
          </button>
        </div>
      </div>
    </div>

    <!-- 预览模态框 -->
    <div
      v-if="showPreview"
      class="modal-overlay"
      @click.self="showPreview = false"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">预览拼接效果</h3>
          <div class="modal-actions">
            <button @click="zoomOut" class="icon-btn">
              <i class="el-icon-zoom-out"></i>
            </button>
            <button @click="zoomIn" class="icon-btn">
              <i class="el-icon-zoom-in"></i>
            </button>
            <button @click="showPreview = false" class="icon-btn">
              <i class="el-icon-close"></i>
            </button>
          </div>
        </div>

        <div class="modal-toolbar">
          <div class="toolbar-group">
            <button @click="zoomSizeOut" class="icon-btn">
              <i class="el-icon-zoom-out"></i>
            </button>
            <button @click="zoomSizeIn" class="icon-btn">
              <i class="el-icon-zoom-in"></i>
            </button>
            <button @click="moveTextUp" class="icon-btn">
              <i class="el-icon-arrow-up"></i>
            </button>
            <button @click="moveTextDown" class="icon-btn">
              <i class="el-icon-arrow-down"></i>
            </button>
            <button @click="moveTextLeft" class="icon-btn">
              <i class="el-icon-arrow-left"></i>
            </button>
            <button @click="moveTextRight" class="icon-btn">
              <i class="el-icon-arrow-right"></i>
            </button>
            <button @click="resetTextPosition" class="icon-btn">
              <i class="el-icon-refresh"></i>
            </button>
          </div>
        </div>

        <div class="modal-color-bar">
          <div class="toolbar-group">
            <button @click="textColor = 'red'" class="icon-btn">红</button>
            <button @click="textColor = 'black'" class="icon-btn">黑</button>
            <button @click="textColor = 'white'" class="icon-btn">白</button>
            <button @click="textColor = '#1685F4'" class="icon-btn">蓝</button>
            <button @click="showText = !showText" class="icon-btn toggle-btn">
              {{ showText ? "不" : "" }}显示
            </button>
          </div>
        </div>

        <div class="preview-wrapper">
          <div
            ref="previewCanvas"
            class="preview-container"
            :style="{
              width: '100%',
              aspectRatio: '1',
              display: 'grid',
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gap: '8px',
              padding: '1px',
            }"
          >
            <div
              v-for="(image, index) in selectedImages"
              :key="index"
              class="grid-item"
            >
              <img class="grid-item-img" :src="image.imageUrl" />
            </div>
            <!-- 组合装文字 -->
            <div
              class="combination-label"
              :style="{ color: textColor }"
              v-if="showText"
            >
              <div class="font-bold">{{ selectedImages.length }}件组合装</div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showPreview = false" class="btn-cancel">取消</button>
          <button @click="saveToLocal" class="btn-primary btn-save">
            保存图片
          </button>
        </div>
      </div>
    </div>

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="success-toast">
      <i class="el-icon-success"></i>
      <span>图片已成功保存到相册！</span>
    </div>
  </div>
</template>

<script>
import { get } from "@/api/request";
import BackHomeButton from "@/components/BackHomeButton.vue";

export default {
  name: "GroupImg",
  components: { BackHomeButton },
  data() {
    return {
      textColor: "red",
      showText: true,
      imageList: [],
      selectedImages: [],
      loading: true,
      gridColumns: 3,
      canvasSize: 600,
      showPreview: false,
      previewGenerated: false,
      showSuccess: false,
      labelPosition: "bottom",
      zoomLevelText: 100,
      zoomLevelRightText: 40,
      zoomLevel: 1,
      zoomSizeLevel: 56,
      textPosition: {
        top: 50,
        left: 50,
      },
    };
  },
  mounted() {
    // 阻止双击事件
    document.addEventListener("dblclick", this.preventDblclick, {
      passive: false,
    });

    this.fetchImages();
  },
  beforeDestroy() {
    document.removeEventListener("dblclick", this.preventDblclick);
  },
  methods: {
    preventDblclick(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },

    // 上下移动方法
    moveTextUp() {
      this.textPosition.top = Math.max(this.textPosition.top - 5, 20);
      this.applyTextPosition();
    },

    moveTextDown() {
      this.textPosition.top = Math.min(this.textPosition.top + 5, 90);
      this.applyTextPosition();
    },

    // 左右移动方法
    moveTextLeft() {
      this.textPosition.left = Math.max(this.textPosition.left - 5, 20);
      this.applyTextPosition();
    },

    moveTextRight() {
      this.textPosition.left = Math.min(this.textPosition.left + 5, 90);
      this.applyTextPosition();
    },

    // 应用文字位置
    applyTextPosition() {
      const textElements =
        this.$refs.previewCanvas?.querySelectorAll(".combination-label");
      if (textElements) {
        textElements.forEach((item) => {
          item.style.top = `${this.textPosition.top}%`;
          item.style.left = `${this.textPosition.left}%`;
        });
      }
    },

    // 重置文字位置到中心
    resetTextPosition() {
      this.textPosition = {
        top: 50,
        left: 50,
      };
      this.applyTextPosition();
      this.zoomSizeLevel = 56;
      this.applySizeZoom();
      this.textColor = "red";
    },

    zoomIn() {
      this.zoomLevel = Math.min((this.zoomLevel || 1) + 0.1, 2.0);
      this.applyZoom();
    },

    zoomOut() {
      this.zoomLevel = Math.max((this.zoomLevel || 1) - 0.1, 0.5);
      this.applyZoom();
    },

    applyZoom() {
      const gridItems =
        this.$refs.previewCanvas?.querySelectorAll(".grid-item-img");
      if (gridItems) {
        gridItems.forEach((item) => {
          item.style.transform = `scale(${this.zoomLevel})`;
        });
      }
    },

    zoomSizeIn() {
      this.zoomSizeLevel = Math.min((this.zoomSizeLevel || 56) + 2, 100);
      this.applySizeZoom();
    },

    zoomSizeOut() {
      this.zoomSizeLevel = Math.max((this.zoomSizeLevel || 56) - 2, 9);
      this.applySizeZoom();
    },

    applySizeZoom() {
      const gridItems =
        this.$refs.previewCanvas?.querySelectorAll(".combination-label");
      if (gridItems) {
        gridItems.forEach((item) => {
          item.style.fontSize = `${this.zoomSizeLevel}px`;
        });
      }
    },

    zoomLeftText() {
      this.zoomLevelRightText = Math.min(
        (this.zoomLevelRightText || 90) + 10,
        100,
      );
      this.applyZoomText("left", "zoomLevelRightText");
    },

    zoomRightText() {
      this.zoomLevelRightText = Math.max(
        (this.zoomLevelRightText || 100) - 10,
        0,
      );
      this.applyZoomText("left", "zoomLevelRightText");
    },

    zoomInText() {
      this.zoomLevelText = Math.min((this.zoomLevelText || 0) + 10, 90);
      this.applyZoomText("top", "zoomLevelText");
    },

    zoomOutText() {
      this.zoomLevelText = Math.max((this.zoomLevelText || 90) - 10, 0);
      this.applyZoomText("top", "zoomLevelText");
    },

    applyZoomText(name, value) {
      const gridItems =
        this.$refs.previewCanvas?.querySelectorAll(".combination-label");
      if (gridItems) {
        gridItems.forEach((item) => {
          item.style[name] = `${this[value]}%`;
        });
      }
    },

    getLabelPositionClass() {
      return {
        "label-top": this.labelPosition === "top",
        "label-middle": this.labelPosition === "middle",
        "label-bottom": this.labelPosition === "bottom",
      };
    },

    moveLabelUp() {
      if (this.labelPosition === "bottom") {
        this.labelPosition = "middle";
      } else if (this.labelPosition === "middle") {
        this.labelPosition = "top";
      }
    },

    moveLabelDown() {
      if (this.labelPosition === "top") {
        this.labelPosition = "middle";
      } else if (this.labelPosition === "middle") {
        this.labelPosition = "bottom";
      }
    },

    async fetchImages() {
      this.loading = true;
      let list = sessionStorage.getItem("imageList");
      if (list?.length) {
        this.imageList = JSON.parse(list);
        this.loading = false;
        return;
      }
      try {
        let res = await get("product/18", { id: 18 });
        this.imageList = res.data?.itemList;
        sessionStorage.setItem("imageList", JSON.stringify(this.imageList));
      } catch (error) {
        console.error("加载图片失败:", error);
      } finally {
        this.loading = false;
      }
    },

    toggleSelection(image) {
      const index = this.selectedImages.indexOf(image);
      if (index === -1) {
        this.selectedImages.push(image);
      } else {
        this.selectedImages.splice(index, 1);
      }
    },

    selectAll() {
      this.selectedImages = [...this.imageList];
    },

    clearSelection() {
      this.selectedImages = [];
      this.previewGenerated = false;
    },

    generatePreview() {
      if (this.selectedImages.length === 0) {
        this.$message
          ? this.$message.warning("请先选择图片")
          : alert("请先选择图片");
        return;
      }
      this.previewGenerated = true;
      this.showPreview = true;

      this.$nextTick(() => {
        this.renderPreview();
      });
    },

    renderPreview() {
      const images = this.selectedImages;
      let loadedCount = 0;

      images.forEach((image) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            console.log("所有图片加载完成，可以预览");
          }
        };
        img.src = image.imageUrl;
      });
    },

    capture() {
      this.$nextTick(() => {
        import("html2canvas").then(({ default: html2canvas }) => {
          html2canvas(this.$refs["previewCanvas"], {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
          }).then((canvas) => {
            this.downloadImage(canvas);
          });
        });
      });
    },

    downloadImage(canvas) {
      const link = document.createElement("a");
      link.download = "screenshot-" + Date.now() + ".png";
      link.href = canvas.toDataURL();
      link.click();
    },

    async saveToLocal() {
      if (!this.previewGenerated) {
        this.$message
          ? this.$message.warning("请先生成预览")
          : alert("请先生成预览");
        return;
      }

      try {
        console.log("开始生成图片...");
        const { default: html2canvas } = await import("html2canvas");
        const previewElement = this.$refs.previewCanvas;
        const canvas = await html2canvas(previewElement, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
        });

        const link = document.createElement("a");
        link.download = `组合装图片-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
        }, 3000);
      } catch (error) {
        console.error("保存图片失败:", error);
        this.$message
          ? this.$message.error("保存失败，请重试")
          : alert("保存失败，请重试");
      }
    },
  },
};
</script>

<style scoped>
.group-img-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 12px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.space-y-5 > * + * {
  margin-top: 1.25rem;
}

/* 头部样式 */
.header-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  position: relative;
}

.back-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.back-btn:hover {
  background: #e5e7eb;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.header-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-secondary {
  padding: 8px 12px;
  background: #f3f4f6;
  color: #374151;
  border-radius: 8px;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
}

/* 图片网格 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.image-card {
  background: white;
  padding: 8px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  aspect-ratio: 1;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.image-card.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.image-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.check-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 32px;
}

.loading-container i {
  color: #3b82f6;
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.loading-container p {
  color: #6b7280;
  font-size: 0.875rem;
}

/* 布局设置 */
.settings-section {
  margin-top: 16px;
}

.settings-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.column-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.column-btn {
  padding: 8px;
  text-align: center;
  border-radius: 8px;
  transition: all 0.2s;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

.column-btn.active {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #93c5fd;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  width: 100%;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-save {
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 448px;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  color: #4b5563;
}

.toggle-btn {
  width: auto;
  padding: 0 12px;
}

.modal-toolbar,
.modal-color-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
}

.modal-color-bar {
  border-bottom: 1px solid #e5e7eb;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 预览区域 */
.preview-wrapper {
  padding: 16px;
  overflow: auto;
}

.preview-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
}

.grid-item {
  background-size: contain;
  background-position: center;
  border-radius: 1px;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-item-img {
  transform-origin: center;
  width: 100%;
}

.combination-label {
  position: absolute;
  top: 54%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 12px;
  font-weight: bold;
  z-index: 10;
  font-size: 56px;
  width: 100%;
  color: #f00;
  line-height: 1;
}

.font-bold {
  font-weight: bold;
}

/* 模态框底部 */
.modal-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.btn-cancel {
  padding: 8px 16px;
  background: #e5e7eb;
  color: #374151;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

/* 成功提示 */
.success-toast {
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  background: #10b981;
  color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 全屏加载效果 */
.full-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner i {
  font-size: 48px;
  color: #3b82f6;
  animation: spin 1s linear infinite;
}

.loading-spinner p {
  margin-top: 16px;
  font-size: 16px;
  color: #374151;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
