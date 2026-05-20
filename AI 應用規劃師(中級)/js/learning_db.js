/**
 * iPAS AI 應用規劃師（中級）能力鑑定——系統化學習知識庫
 * 100% 繁體中文，嚴格對齊『L21 人工智慧技術應用與規劃_電子版.pdf』的九大單元結構
 * 融合 114 年第二次歷屆試題考情與 2025-2026 前沿 AI 代理、GraphRAG、MLOps 漂移監控等必考點
 */
const LEARNING_DATABASE = [
  {
    "id": "L21101",
    "title": "L21101 自然語言處理技術與應用",
    "description": "涵蓋 NLP 核心任務（意圖識別、語意標註、詞義消歧）、詞嵌入表示（Word2Vec vs GloVe）及預訓練模型之評估與應用。",
    "topics": [
      {
        "id": "t_21101_1",
        "title": "1.1 NLP 核心任務與商業應用實務",
        "content": `
        <h4>自然語言處理核心任務與 IPAS 中級必考點</h4>
        <p>在 iPAS 中級鑑定中，NLP 的技術選型、模型評估與商業場景對齊是核心考點，特別是以下幾個進階任務的定義與區分：</p>
        
        <ul>
          <li><strong>意圖識別 (Intent Recognition)</strong>：判斷使用者輸入文字背後的真實目的（例如在客服對話中，系統需要判斷用戶的輸入「我想退掉昨天買的衣服」是屬於「退貨意圖」還是「商品諮詢」），這是對話機器人與 AI 代理進行決策路由的關鍵第一步。</li>
          <li><strong>語意角色標註 (Semantic Role Labeling, SRL)</strong>：一種淺層語意分析技術。主要任務是給定一個句子，分析其中各個成分對謂詞（Verb/Predicate）所扮演的語意角色（如「誰」是施事者 Agent、「對誰」是受事者 Patient、「何時/何地」是伴隨狀態等）。這能幫助系統結構化地提取非結構化文本中的事件資訊。</li>
          <li><strong>自然語言推理 (Natural Language Inference, NLI)</strong>：給定一個「前提 (Premise)」和一個「假設 (Hypothesis)」，判斷假設與前提之間的關係是<strong>蘊涵 (Entailment)</strong>、<strong>矛盾 (Contradiction)</strong> 還是<strong>中立 (Neutral)</strong>。這廣泛應用於事實查核與語意矛盾檢測。</li>
          <li><strong>詞義消歧 (Word Sense Disambiguation, WSD)</strong>：在特定上下文環境中，精確確定一個多義詞的具體字義（例如「蘋果」在「蘋果一斤多少錢」中指水果，在「蘋果發表了最新手機」中指科技公司），是提升檢索與翻譯精確度的基石。</li>
          <li><strong>語意文本相似度 (Semantic Textual Similarity, STS)</strong>：量化兩段文字在語意層面的相似程度，通常輸出一個介於 0 到 5 之間的連續值或餘弦相似度。</li>
        </ul>

        <div class="info-block">
          <h5>💡 考點複習：自然語言處理任務對應</h5>
          <p>考試中極常出現「某個實際商業場景最適合採用哪種 NLP 任務技術」的選擇題。例如：自動化合約條款矛盾審查最適用 <strong>NLI (自然語言推理)</strong>；而智慧音箱接收語音指令進行家電控制，第一步最需要 <strong>Intent Recognition (意圖識別)</strong>。</p>
        </div>
        `
      },
      {
        "id": "t_21101_2",
        "title": "1.2 詞向量與表示模型演進 (Word2Vec vs GloVe)",
        "content": `
        <h4>從靜態詞嵌入到全局特徵表示</h4>
        <p>理解詞向量的數學本質與模型差異，是掌握深度 NLP 應用的基礎。以下為 Word2Vec 與 GloVe 的深度對比：</p>
        
        <ul>
          <li><strong>Word2Vec (Google)</strong>：
            <ul>
              <li><strong>本質</strong>：基於預測 (Predictive-based) 的淺層神經網路模型。</li>
              <li><strong>運作機制</strong>：採用局部滑動窗口 (Local Context Window)，分為 <strong>CBOW</strong>（利用上下文預測目標詞）與 <strong>Skip-gram</strong>（利用目標詞預測上下文）兩種架構，透過神經網路反向傳播更新權重來學習詞表示。</li>
              <li><strong>局限</strong>：僅考慮了滑動窗口內的局部共現資訊，無法有效利用整個語料庫的全局共現統計。</li>
            </ul>
          </li>
          <li><strong>GloVe (Global Vectors, Stanford)</strong>：
            <ul>
              <li><strong>本質</strong>：基於統計共現 (Count-based) 的矩陣分解模型。</li>
              <li><strong>運作機制</strong>：直接對整個語料庫進行掃描，構建出一個<strong>全局詞共現矩陣 (Global Co-occurrence Matrix)</strong>，然後利用非線性最小二乘擬合 (Nonlinear Least Squares) 對該矩陣進行矩陣分解與降維，學習詞向量。</li>
              <li><strong>優勢</strong>：結合了全局矩陣分解與局部滑動窗口的優點，能更好地捕捉全局語意比例關係。</li>
            </ul>
          </li>
        </ul>

        <div class="info-block" style="border-left-color: #3b82f6;">
          <h5>📐 核心考點：GloVe 的主要目標</h5>
          <p>GloVe 模型的核心思想是：兩個詞相對於第三個對照詞的<strong>共現概率比值 (Ratio of Co-occurrence Probabilities)</strong> 包含了非常強的語意資訊。因此，GloVe 是直接針對「概率比值」進行擬合，而非僅僅是共現概率本身。</p>
        </div>
        `
      }
    ]
  },
  {
    "id": "L21102",
    "title": "L21102 電腦視覺技術與應用",
    "description": "涵蓋卷積神經網路 (CNN) 架構演進、輕量化設計，以及物件偵測 (IoU, mAP) 與影像分割的評估指標。",
    "topics": [
      {
        "id": "t_21102_1",
        "title": "2.1 CNN 架構演進與輕量化模型設計",
        "content": `
        <h4>卷積神經網路 (CNN) 的經典架構與演進</h4>
        <p>電腦視覺是工業瑕疵檢測、智慧監控與自駕車的核心。考生須精確掌握以下架構演進：</p>
        
        <ul>
          <li><strong>AlexNet (2012)</strong>：引入 ReLU 激活函數解決梯度飽和，使用 Dropout 防止過擬合，開啟了深度學習的浪潮。</li>
          <li><strong>VGG (2014)</strong>：證實了「使用多個 $3\times3$ 小型卷積核代替大卷積核」能增加網路深度、減少參數量並引入更多非線性變換。</li>
          <li><strong>ResNet (2015)</strong>：引入<strong>殘差連接 (Residual Connection / Skip Connection)</strong>，讓梯度能直接越層傳播，徹底解決了網路極深時的<strong>梯度消失 (Gradient Vanishing)</strong> 與退化問題。</li>
          <li><strong>MobileNet (輕量化首選)</strong>：
            <p>專為移動端與嵌入式設備設計，其核心是將標準卷積拆分為<strong>深度可分離卷積 (Depthwise Separable Convolution)</strong>：</p>
            <ol>
              <li><strong>Depthwise 卷積</strong>：對每個輸入通道單獨進行單通道卷積，不改變通道數。</li>
              <li><strong>Pointwise 卷積</strong>：使用 $1\times1$ 卷積將 Depthwise 的輸出通道進行線性組合，調整至目標通道數。</li>
            </ol>
            <p><strong>效益</strong>：大幅降低了計算複雜度 (FLOPs) 與參數量，一般可降低至標準卷積的 1/8 到 1/9，而準確度僅微幅下降。</p>
          </li>
        </ul>
        `
      },
      {
        "id": "t_21102_2",
        "title": "2.2 物件偵測與影像分割層次與指標",
        "content": `
        <h4>物件偵測與影像分割的評估與實現</h4>
        <p>影像分析任務依據精細度與商業需求，分為不同的層次，其對應的評估指標是中級鑑定的常客：</p>
        
        <ul>
          <li><strong>物件偵測指標</strong>：
            <ul>
              <li><strong>IoU (Intersection over Union，交併比)</strong>：預測框 (Prediction) 與真實框 (Ground Truth) 的交集面積除以併集面積。</li>
              <li><strong>mAP (Mean Average Precision)</strong>：所有類別 Average Precision (AP) 的平均值。當 IoU 閾值設定較高時（例如 mAP@0.75，代表只有預測框與真實框 IoU 大於 0.75 才會被計為 True Positive），對模型邊界框的定位精確度要求極高。</li>
            </ul>
          </li>
          <li><strong>影像分割的三個層次</strong>：
            <ul>
              <li><strong>語義分割 (Semantic Segmentation)</strong>：像素級別的分群，區分不同類別（例如將影像中所有的「人」塗成藍色，「車」塗成紅色，不區分個體）。常見網路如 <strong>FCN</strong>, <strong>U-Net</strong>。</li>
              <li><strong>實例分割 (Instance Segmentation)</strong>：不僅要區分不同類別，還必須區分同一類別中的不同個體（例如將人 A 塗成藍色、人 B 塗成綠色，以區分個體）。經典網路如 <strong>Mask R-CNN</strong>。</li>
              <li><strong>全景分割 (Panoptic Segmentation)</strong>：全方位影像分割。結合語義分割（針對背景 background/stuff，如天空、草地）與實例分割（針對前景可數個體 objects/things，如人、車）。</li>
            </ul>
          </li>
        </ul>
        `
      }
    ]
  },
  {
    "id": "L21103",
    "title": "L21103 生成式 AI 技術與應用",
    "description": "深入解析生成式對抗網路 (GAN)、變分自編碼器 (VAE)、擴散模型 (Diffusion)，以及 2025-2026 前沿之 GraphRAG 最新架構。",
    "topics": [
      {
        "id": "t_21103_1",
        "title": "3.1 生成式三大模型架構 (GAN, VAE, Diffusion)",
        "content": `
        <h4>生成式 AI 架構深度剖析與數學原理</h4>
        <p>生成式模型是目前 AI 技術的顯學，考生需深入理解其底層數學與運作機制：</p>
        
        <ul>
          <li><strong>GAN (Generative Adversarial Networks)</strong>：
            <p>由<strong>生成器 (Generator)</strong> 與<strong>判別器 (Discriminator)</strong> 組成，兩者進行極小極大博弈 (Minimax Game)。</p>
            <ul>
              <li><strong>模式崩潰 (Mode Collapse)</strong>：生成器發現某些特定樣本特別容易騙過判別器，於是重複產生極度單一、缺乏多樣性的樣本。</li>
              <li><strong>解決手段 (WGAN)</strong>：引入 <strong>Wasserstein 距離 (Earth Mover's Distance)</strong> 代替傳統的 JS 散度，提供更平滑的梯度，徹底解決了模式崩潰與訓練不穩定的問題。</li>
            </ul>
          </li>
          <li><strong>VAE (Variational Autoencoder)</strong>：
            <p>基於概率圖模型的自編碼器。將輸入編碼為潛在空間 (Latent Space) 的概率分佈（即均值 $\mu$ 與方差 $\sigma^2$），再從中採樣進行解碼生成。</p>
            <p><strong>重參數化技巧 (Reparameterization Trick)</strong>：為解決「隨機採樣步驟無法進行反向傳播梯度傳遞」的難題，VAE 將採樣過程改寫為 $z = \mu + \sigma \odot \epsilon$（其中 $\epsilon \sim \mathcal{N}(0, I)$），將隨機性轉移到無梯度的外部噪聲 $\epsilon$ 上，使整個網路可利用反向傳播進行端到端訓練。</p>
          </li>
          <li><strong>Diffusion Models (擴散模型)</strong>：
            <p>目前生成影像的主流。分為<strong>前向步驟 (Forward Process)</strong>（逐步向影像加入高斯噪聲，直至變為純噪聲）與<strong>反向步驟 (Reverse Process)</strong>（訓練神經網路學習逐步去噪，從純噪聲中還原出高品質影像）。</p>
          </li>
        </ul>
        `
      },
      {
        "id": "t_21103_2",
        "title": "3.2 GraphRAG：結合知識圖譜的檢索增強生成 (2025-2026 最新)",
        "content": `
        <h4>從向量 RAG 演進至 GraphRAG 的技術變革</h4>
        <p>在企業級生成式 AI 應用中，如何消弭 LLM 的「幻覺 (Hallucination)」並引入最新企業知識是關鍵。傳統基於向量相似度的 RAG 存在極大局限，催生了最新一代的 <strong>GraphRAG</strong> 架構：</p>
        
        <table class="data-table">
          <thead>
            <tr>
              <th>比較維度</th>
              <th>傳統向量 RAG (Baseline RAG)</th>
              <th>GraphRAG (Microsoft / 前沿架構)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>知識表示</strong></td>
              <td>將文本切成碎片 (Chunks)，轉化為高維向量存儲。</td>
              <td>利用 LLM 提取文本中的「實體與關係」，構建<strong>知識圖譜 (Knowledge Graph)</strong>。</td>
            </tr>
            <tr>
              <td><strong>檢索機制</strong></td>
              <td>基於餘弦相似度 (Cosine Similarity) 檢索最相似的 Top-K 文本碎片。</td>
              <td>利用圖演算法進行<strong>社群聚類 (Community Detection)</strong>，預先生成社群主題摘要。</td>
            </tr>
            <tr>
              <td><strong>擅長問題</strong></td>
              <td>局部性具體問題（如「公司2025年的出差補助是多少？」）。</td>
              <td>全局性、總結性與關聯性問題（如「這份合約中所有利害關係人之間的衝突點為何？」）。</td>
            </tr>
            <tr>
              <td><strong>防幻覺能力</strong></td>
              <td>中等，容易因文本切片過碎、缺乏上下文而產生語意斷層。</td>
              <td>極佳，因為檢索是基於結構化的知識圖譜社群摘要，語意關聯極為完整。</td>
            </tr>
          </tbody>
        </table>

        <div class="info-block" style="border-left-color: #a855f7; margin-top: 1.5rem;">
          <h5>Leiden 圖社群聚類演算法的應用</h5>
          <p>GraphRAG 的核心步驟是使用 <strong>Leiden 演算法</strong> 對知識圖譜進行無監督聚類，將圖譜自動劃分為多個不同層級的緊密社群。接著，系統對每個社群生成摘要，當用戶提問時，檢索系統就能在全局層面上找到對應社群的摘要，實現極致的高質量總結生成。</p>
        </div>
        `
      }
    ]
  },
  {
    "id": "L21104",
    "title": "L21104 多模態人工智慧應用",
    "description": "深入理解多模態對比學習基礎 (CLIP)、跨模態對齊機制以及多模態在前沿 AI 代理與商業場景中的落地。",
    "topics": [
      {
        "id": "t_21104_1",
        "title": "4.1 CLIP 對比式學習與共同嵌入空間",
        "content": `
        <h4>多模態對齊的里程碑：CLIP 架構</h4>
        <p>隨著多模態 AI（如 GPT-4o, Gemini）的爆發，如何讓模型同時「看懂影像」與「讀懂文字」成為核心。OpenAI 提出的 <strong>CLIP (Contrastive Language-Image Pre-training)</strong> 是多模態對齊的黃金標準：</p>
        
        <ul>
          <li><strong>雙塔架構</strong>：包含一個<strong>影像編碼器 (Image Encoder)</strong>（通常為 ResNet 或 ViT）與一個<strong>文本編碼器 (Text Encoder)</strong>（Transformer）。</li>
          <li><strong>對比式學習 (Contrastive Learning)</strong>：
            <p>在一個包含 $N$ 個圖文對的 Batch 中，CLIP 的訓練目標是將圖像與文字投影到一個<strong>共同嵌入空間 (Shared Embedding Space)</strong>，並且：</p>
            <ol>
              <li>極大化 $N$ 對「正確配對（正樣本）」圖文向量之間的<strong>餘弦相似度 (Cosine Similarity)</strong>。</li>
              <li>極小化 $N^2 - N$ 對「錯誤配對（負樣本）」圖文向量之間的相似度。</li>
            </ol>
          </li>
          <li><strong>零樣本分類 (Zero-shot Classification)</strong>：
            <p>CLIP 不需要針對特定類別進行微調。要進行零樣本分類時，只需將候選標籤放入模板（如「一張 [類別] 的照片」），通過文本編碼器得到特徵向量，再與圖像特徵計算相似度，相似度最高者即為分類結果。</p>
          </li>
        </ul>

        <div class="info-block" style="border-left-color: #10b981;">
          <h5>⚠️ 考點直擊：對比式損失函數</h5>
          <p>CLIP 採用對稱的 Cross-entropy 損失函數。它是同時計算「給定圖像，預測對應文字」與「給定文字，預測對應圖像」兩個方向的損失，並取平均值作為總損失進行聯合優化。</p>
        </div>
        `
      },
      {
        "id": "t_21104_2",
        "title": "4.2 多模態主流架構與 AI Agent 智慧代理 (2025-2026 前沿)",
        "content": `
        <h4>多模態應用與 AI Agent 的自主決策架構</h4>
        <p>2025 至 2026 年是 AI 應用的黃金時代，其最核心的方向是結合多模態能力的 <strong>AI Agent (智慧代理)</strong>：</p>
        
        <ul>
          <li><strong>AI Agent 四大核心支柱</strong>：
            <ol>
              <li><strong>規劃 (Planning)</strong>：
                <ul>
                  <li><strong>子目標分解 (Subgoal Decomposition)</strong>：將複雜任務拆解為可執行的具體小步驟。</li>
                  <li><strong>反思與自我修正 (Reflection & Self-Correction)</strong>：利用 ReAct (Reasoning + Acting) 或 Reflexion 架構，在執行完步驟後，自我審查結果，若發現錯誤則動態修正執行路徑。</li>
                </ul>
              </li>
              <li><strong>記憶 (Memory)</strong>：
                <ul>
                  <li><strong>短期記憶</strong>：將當前會話的所有內容作為 Prompt 傳入 LLM，受限於 Context Window。</li>
                  <li><strong>長期記憶</strong>：利用外部<strong>向量資料庫 (Vector Database)</strong>，將關鍵知識向量化並持久化存儲，供後續檢索。</li>
                </ul>
              </li>
              <li><strong>工具調用 (Tool Use / Function Calling)</strong>：
                <p>Agent 能夠辨識自身知識的局限（如無法做複雜數學計算或獲取即時天氣），並主動生成標準 JSON 格式以調用外部 API（如計算器、搜尋引擎、Python 執行沙盒）。</p>
              </li>
              <li><strong>多模態執行器 (Multimodal Action)</strong>：
                <p>能夠同時解析語音、文字與視覺輸入，並控制瀏覽器或 API 進行操作（如自動在網頁上訂機票、進行螢幕截圖並分析報表錯誤）。</p>
              </li>
            </ol>
          </li>
        </ul>
        `
      }
    ]
  },
  {
    "id": "L21201",
    "title": "L21201 AI 導入評估",
    "description": "企業導入 AI 系統的可行性評估、ROI 財務分析（TCO、回收期計算）與智慧流程自動化 (IPA) 技術評估實務。",
    "topics": [
      {
        "id": "t_21201_1",
        "title": "5.1 企業 AI 導入與財務評估 (ROI & TCO)",
        "content": `
        <h4>企業 AI 專案可行性與財務評估實務</h4>
        <p>企業在導入 AI 系統時，決策者最關心的是技術可行性與商業投資回報率 (ROI)。考生須熟記以下關鍵財務與導入指標：</p>
        
        <ul>
          <li><strong>TCO (Total Cost of Ownership，總體擁有成本)</strong>：
            <p>不僅包含初期的硬體採購與模型開發費用，還包含後續的運維、授權費、GPU 電費、以及<strong>隱性成本</strong>（如員工培訓、因系統出錯導致的業務流失）。</p>
            <p class="text-danger"><strong>⚠️ 常見陷阱：</strong>專案規劃中最容易被低估的成本是<strong>「資料收集、清理與持續標註的成本」</strong>，這部分通常佔據了專案初期預算的 60% 以上。</p>
          </li>
          <li><strong>Payback Period (投資回收期)</strong>：
            <p>指專案的累積淨收益等於初始投資額所需的時間。回收期越短，專案風險越低。</p>
          </li>
          <li><strong>智慧流程自動化 (IPA, Intelligent Process Automation)</strong>：
            <p>將 RPA (機器人流程自動化) 與 AI（如 OCR、NLP）結合。在評估 IPA 導入可行性時，<strong>最核心的初步效益是提高操作效率與流程一致性</strong>。評估時必須優先選擇「標準化程度高、重複性強且規則明確」的業務流程。</p>
          </li>
        </ul>
        `
      },
      {
        "id": "t_21201_2",
        "title": "5.2 技術可行性與模型選型評估",
        "content": `
        <h4>模型選型與架構權衡</h4>
        <p>技術評估的核心在於「在精度、速度與成本之間取得最優解」：</p>
        
        <ul>
          <li><strong>自建自訓模型 vs 調用 API vs 開源模型微調 (Fine-tuning)</strong>：
            <ul>
              <li><strong>調用 API (如 OpenAI API)</strong>：初期開發速度最快、無硬體投資成本。但長期運行成本隨請求量呈線性增長，且存在資料隱私外洩風險。</li>
              <li><strong>開源模型微調 (如 Llama-3-8B)</strong>：折衷方案。可完全地端部署保證隱私，且透過參數高效微調 (PEFT, 如 LoRA) 能以極低硬體需求讓模型適應特定業務場景。</li>
              <li><strong>完全自訓 (Pre-train from scratch)</strong>：成本極高（數百萬美元），僅適用於具備海量獨特領域數據且對基礎特徵要求極高的大型企業。</li>
            </ul>
          </li>
          <li><strong>計算資源需求評估</strong>：
            <p>必須評估推論時的<strong>吞吐量 (Throughput)</strong> 與<strong>延遲 (Latency)</strong>。在邊緣計算設備（如工業相機）上，應優先評估模型輕量化技術（如量化 Quantization、知識蒸餾 Knowledge Distillation、剪枝 Pruning）。</p>
          </li>
        </ul>
        `
      }
    ]
  },
  {
    "id": "L21202",
    "title": "L21202 AI 導入規劃",
    "description": "規劃 AI 專案生命週期（MLOps）、CI/CD Pipeline、系統架構選型（雲端 vs 地端）與高可用架構整合。",
    "topics": [
      {
        "id": "t_21202_1",
        "title": "6.1 AI 專案生命週期管理與 MLOps 實務",
        "content": `
        <h4>機器學習專案生命週期與 MLOps 核心管線</h4>
        <p>一個成功的 AI 專案絕對不僅僅是「模型訓練」，更需要建立一整套自動化的運維流程（MLOps）：</p>
        
        <ol>
          <li><strong>問題定義與商業對齊</strong>：明確定義評估指標（如精確率 Precision 還是召回率 Recall）。對於癌症檢測，應優先優化召回率以防止漏診。</li>
          <li><strong>數據準備</strong>：包含數據收集、去噪、不平衡處理（如使用 SMOTE 算法過採樣）。</li>
          <li><strong>模型研發與驗證</strong>：離線訓練，並使用交叉驗證 (Cross Validation) 評估模型泛化能力。</li>
          <li><strong>自動化重新訓練管線 (Continuous Retraining Pipeline)</strong>：
            <p>當模型部署至生產環境後，必須監控實際推論數據。當偵測到資料漂移時，應自動觸發管線，利用最新收集的數據重新訓練模型，並完成自動化測試後上線。</p>
          </li>
        </ol>

        <div class="info-block">
          <h5>🔄 CI/CD vs CT</h5>
          <p>在傳統軟體中，我們關注 CI/CD (持續集成與持續部署)；而在 AI 系統中，還必須引入 <strong>CT (Continuous Training, 持續訓練)</strong>。這是 AI 導入規劃中最具技術挑戰的範疇，需要建立自動化數據回流與模型自動評估機制。</p>
        </div>
        `
      },
      {
        "id": "t_21202_2",
        "title": "6.2 系統架構選型與集成方案",
        "content": `
        <h4>地端 vs 雲端 vs 混合雲架構規劃</h4>
        <p>在規劃 AI 系統的基礎架構時，需要針對安全性、合規性與擴展性進行權衡：</p>
        
        <ul>
          <li><strong>地端部署 (On-Premise)</strong>：
            <p><strong>適用場景</strong>：受高度監管的產業（如金融、醫療、軍事），數據隱私要求極高，且數據量極大不適合高頻上傳雲端。</p>
            <p><strong>缺點</strong>：初始硬體投資 (CapEx) 高，折舊成本高，且缺乏彈性擴展能力。</p>
          </li>
          <li><strong>雲端部署 (Cloud SaaS / PaaS)</strong>：
            <p><strong>適用場景</strong>：快速迭代的初創專案，對彈性擴展 (Auto-scaling) 要求高。可按需付費，將資本支出 (CapEx) 轉化為營運支出 (OpEx)。</p>
            <p><strong>缺點</strong>：存在數據合規風險（如個人資料不能離境），長期高吞吐推論的累積頻寬與 API 調用成本高昂。</p>
          </li>
          <li><strong>高可用與異步集成方案</strong>：
            <p>在大規模推論場景中，若採用同步 HTTP 請求，當流量暴增時會造成伺服器崩潰。架構規劃上應引入<strong>消息隊列 (Message Queue, 如 Kafka)</strong> 進行異步解耦與削峰填谷，配合微服務容器化 (Docker + Kubernetes) 進行自動彈性擴展。</p>
          </li>
        </ul>
        `
      }
    ]
  },
  {
    "id": "L21203",
    "title": "L21203 AI 風險管理",
    "description": "聚焦負責任 AI 核心原則、可解釋性 AI 技術（SHAP, LIME）、對抗性安全防禦，與台灣發布之《人工智慧導入指引》合規細節。",
    "topics": [
      {
        "id": "t_21203_1",
        "title": "7.1 可解釋性 AI (XAI) 與對抗性防禦技術",
        "content": `
        <h4>黑盒模型的可解釋性與安全性防禦</h4>
        <p>隨著深度學習的普及，模型的「可解釋性」與「安全性」已成為合規與風險管理的重中之重：</p>
        
        <ul>
          <li><strong>可解釋性 AI (XAI) 兩大黃金標準</strong>：
            <ul>
              <li><strong>SHAP (SHapley Additive exPlanations)</strong>：基於合作賽局理論，計算每個特徵對模型最終預測結果的<strong>邊際貢獻度</strong>。SHAP 的優勢在於具備堅實的數學基礎，同時支持局部解釋（單一樣本）與全局解釋（整體特徵重要性分佈），是目前金控機構信用評等模型的首選。</li>
              <li><strong>LIME (Local Interpretable Model-agnostic Explanations)</strong>：在要解釋的單一預測樣本局部鄰域內進行隨機擾動，訓練一個結構簡單的線性替代模型來近似黑盒模型的決策邊界，實現局部語意解釋。</li>
            </ul>
          </li>
          <li><strong>對抗性攻擊與防禦技術</strong>：
            <ul>
              <li><strong>對抗性攻擊 (Adversarial Attacks)</strong>：在原始輸入中加入人類肉眼無法察覺的微小擾動，刻意誘導 AI 模型做出災難性的錯誤判斷（例如在停止標誌上貼上特定貼紙，讓自駕車將其識別為速限 100 公里）。常見方法如 FGSM。</li>
              <li><strong>防禦手段</strong>：主要包括<strong>對抗性訓練 (Adversarial Training)</strong>（在訓練數據集中加入對抗樣本一起訓練）、<strong>輸入轉化/去噪</strong>，以及<strong>模型蒸餾 (Model Distillation)</strong> 以平滑決策邊界。</li>
            </ul>
          </li>
        </ul>
        `
      },
      {
        "id": "t_21203_2",
        "title": "7.2 台灣《人工智慧導入指引》七大原則與合規要點",
        "content": `
        <h4>台灣最新合規時事考點 (2025-2026 核心)</h4>
        <p>為引導台灣各產業安全、負責地導入人工智慧，行政院與數位發展部發布了最新版<strong>《人工智慧導入指引》</strong>，此內容已成為最新鑑定的核心必考熱點。考生須熟記七大核心原則與具體要求：</p>
        
        <div class="info-block" style="border-left-color: #ec4899;">
          <h5>📋 台灣《人工智慧導入指引》核心七大原則</h5>
          <ol>
            <li><strong>人本與自主性</strong>：AI 的發展應以人為本，保護人類尊嚴與自主選擇權。決策鏈中應保有<strong>人類監督 (Human-in-the-loop)</strong> 機制，人類應有最終否決權。</li>
            <li><strong>安全性與可靠性</strong>：系統在生命週期內應具備抗挫折與抗干擾能力，防範網絡攻擊與惡意篡改，確保系統運作穩定。</li>
            <li><strong>隱私與數據治理</strong>：遵循個人資料保護法，採用去識別化、數據最小化搜集，確保訓練數據來源合法、隱私合規。</li>
            <li><strong>透明度與可解釋性</strong>：AI 的決策邏輯應具備可追溯性與可解釋性，向受決策影響之關係人提供合理的說明途徑。</li>
            <li><strong>公平性與非歧視</strong>：防範演算法偏見 (Algorithmic Bias)，確保訓練數據的多樣性與代表性，避免因歷史數據偏差造成對特定群體的系統性不公。</li>
            <li><strong>問責與負責任</strong>：明確劃分 AI 系統開發者、導入者與使用者的責任歸屬，建立完善的審計可責任化機制。</li>
            <li><strong>環境永續</strong>：考量大模型訓練與推論的巨大能耗，積極推動綠色運算 (Green Computing) 與高效能模型壓縮技術。</li>
          </ol>
        </div>
        `
      }
    ]
  },
  {
    "id": "L21301",
    "title": "L21301 數據準備與模型選擇",
    "description": "深入掌握高階數據前處理（Z-score、PCA 降維、共線性防治）、DBSCAN 密度聚類調參及 PyTorch 遷移學習權重凍結代碼。",
    "topics": [
      {
        "id": "t_21301_1",
        "title": "8.1 高階數據前處理與共線性防治 (特徵工程核心)",
        "content": `
        <h4>資料標準化與降維的數學邏輯</h4>
        <p>在進行特徵工程時，數據的縮放與降維直接影響後續算法的表現，也是科目二與科目三的計算與概念核心：</p>
        
        <ul>
          <li><strong>Z-score 標準化 (Standardization)</strong>：
            <p>將資料轉化為均值為 0、標準差為 1 的正態分佈。公式為：</p>
            <div class="formula">$$z = \frac{x - \mu}{\sigma}$$</div>
            <p><strong>適用時機</strong>：當特徵中存在極端異常值，或演算法依賴距離計算（如 K-Means、SVM、KNN、PCA、梯度下降法）時。相較於 Min-Max 縮放，Z-score 不會因為單一極端極值而將所有正常數據壓縮在極小區間內。</p>
          </li>
          <li><strong>PCA (主成分分析) 降維</strong>：
            <p>利用正交轉換將一組可能存在相關性的變數，轉換為一組線性無關的變數（即主成分）。<strong>極重要考點：</strong>進行 PCA 之前，<strong>必須先對資料進行標準化 (Z-score)</strong>，否則數值範圍較大的特徵會支配協方差矩陣，導致降維結果產生嚴重偏差。</p>
          </li>
          <li><strong>多重共線性 (Multicollinearity) 的識別與防治</strong>：
            <p>特徵之間高度相關，會使線性模型（如線性迴歸、邏輯迴歸）的權重係數估計極不穩定。<strong>防範策略</strong>：
              <ol>
                <li>使用 <strong>VIF (Variance Inflation Factor，方差膨脹因子)</strong> 進行篩選（一般 VIF > 10 代表存在嚴重共線性）。</li>
                <li>採用 <strong>L1 正則化 (Lasso 迴歸)</strong>，它具有特徵選擇功能，會將不重要且高度相關特徵的權重直接壓縮至 0。</li>
                <li>採用 <strong>PCA</strong> 將共線性特徵轉換為彼此獨立的主成分。</li>
              </ol>
            </p>
          </li>
        </ul>
        `
      },
      {
        "id": "t_21301_2",
        "title": "8.2 DBSCAN 分群與 PyTorch 權重凍結程式實務 (25% 程式必考)",
        "content": `
        <h4>iPAS 必考 Python 核心代碼解析</h4>
        <p>針對官方考綱中 25% 程式題要求，考生必須精確掌握以下兩大核心算法的調校與程式片段：</p>
        
        <div class="formula-box">
          <h5>🔑 1. DBSCAN 密度分群核心參數與程式碼</h5>
          <ul>
            <li><strong>鄰域半徑 (<code>eps</code>, $\epsilon$)</strong>：定義一個點的鄰域半徑。若 eps 設得太小，大部分正常點會被判定為離群噪噪點 (-1)；設得太大，多個獨立的群集會被融合成一個。</li>
            <li><strong>最小點數 (<code>min_samples</code>, MinPts)</strong>：核心點鄰域內所需最少樣本點數。</li>
          </ul>
          <pre><code class="language-python">from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler

# 1. 考點：DBSCAN 依賴距離，分群前必須標準化！
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 2. 初始化並配合 eps 與 min_samples 進行訓練
db = DBSCAN(eps=0.5, min_samples=5, metric='euclidean')
labels = db.fit_predict(X_scaled)

# 3. labels 若為 -1，代表被識別為「噪聲/離群點 (Noise)」
n_noise = list(labels).count(-1)
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
</code></pre>
        </div>

        <div class="formula-box" style="margin-top: 1.5rem;">
          <h5>🔑 2. PyTorch 遷移學習權重凍結與微調 (Fine-tuning)</h5>
          <pre><code class="language-python">import torch
import torch.nn as nn
from torchvision import models

# 1. 載入預訓練模型
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

# 2. 核心考點：凍結特徵提取層的所有權重 (requires_grad 設為 False)
for param in model.parameters():
    param.requires_grad = False

# 3. 核心考點：替換最後的分類全連接層 (新層預設 requires_grad 為 True)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 2)  # 替換為適配我們任務的二分類層

# 4. 優化器只傳入需要更新的參數
optimizer = torch.optim.Adam(
    filter(lambda p: p.requires_grad, model.parameters()), 
    lr=0.001
)
</code></pre>
        </div>
        `
      }
    ]
  },
  {
    "id": "L21302",
    "title": "L21302 AI 技術系統集成與部署",
    "description": "深入大數據分散式架構（Spark vs Ray）、MLOps 模型漂移監控（PSI、KL 散度數學公式），以及同態加密與差分隱私技術。",
    "topics": [
      {
        "id": "t_21302_1",
        "title": "9.1 大數據運算架構比較 (Spark vs Ray)",
        "content": `
        <h4>大規模分散式計算架構深度剖析</h4>
        <p>在大數據分析與分散式 AI 訓練中，選擇合適的運算框架是決定系統成敗的關鍵，也是科目二的核心考點：</p>

        <table class="data-table">
          <thead>
            <tr>
              <th>比較維度</th>
              <th>Apache Spark</th>
              <th>Ray (新一代分散式計算架構)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>核心抽象</strong></td>
              <td>RDD (彈性分散式數據集)、DataFrame。</td>
              <td>Actors (有狀態計算) & Tasks (無狀態函數)。</td>
            </tr>
            <tr>
              <td><strong>計算模式</strong></td>
              <td>BSP (Bulk Synchronous Parallel) 數據並行模式，適合結構化 ETL、批處理與資料湖集成。</td>
              <td>動態任務圖 (Dynamic Task Graph)，極適合複雜的、異步的機器學習訓練、強化學習與分散式推理。</td>
            </tr>
            <tr>
              <td><strong>記憶體管理</strong></td>
              <td>記憶體內計算，透過血統 (Lineage) 機制實現容錯，避免了 Hadoop MapReduce 的頻繁寫盤。</td>
              <td>共享記憶體物件存儲 (Plasma Object Store)，支持多進程間的<strong>零拷貝 (Zero-copy) 數據讀取</strong>，極大提升了大型 NumPy 矩陣傳輸效率。</td>
            </tr>
            <tr>
              <td><strong>調度延遲</strong></td>
              <td>毫秒級延遲。</td>
              <td>微秒級延遲，支持每秒百萬級的彈性任務調度。</td>
            </tr>
          </tbody>
        </table>
        `
      },
      {
        "id": "t_21302_2",
        "title": "9.2 MLOps 模型監控 (PSI & KL) 與隱私保護技術",
        "content": `
        <h4>模型漂移監控與隱私計算技術</h4>
        <p>模型上線後的持續維運 (MLOps) 與敏感數據的安全共享是企業落地的最後一公里：</p>
        
        <ul>
          <li><strong>資料與概念漂移 (Drift) 監控</strong>：
            <p><strong>PSI (Population Stability Index，群體穩定性指標)</strong>：用於衡量基準數據 (Baseline) 與實際推論數據 (Target) 的分佈差異。公式為：</p>
            <div class="formula">
              $$PSI = \sum_{i=1}^{k} \left( P_i - Q_i \right) \times \ln\left(\frac{P_i}{Q_i}\right)$$
            </div>
            <p>其中 $P_i$ 為實際推論數據佔比，$Q_i$ 為基準數據佔比。<strong>決策門檻：</strong></p>
            <ul>
              <li><strong>PSI &lt; 0.1</strong>：模型分佈極度穩定，無需處理。</li>
              <li><strong>0.1 &le; PSI &lt; 0.25</strong>：中度變化，需密切監控，規劃模型<strong>定期重新訓練 (Retraining)</strong>。</li>
              <li><strong>PSI &ge; 0.25</strong>：分佈發生顯著漂移！<strong>必須立即觸發警告並啟動模型重新訓練與重新部署</strong>。</li>
            </ul>
            <p><strong>KL 散度 (Relative Entropy)</strong>：用於量化兩個概率分佈的不相似度，公式為 $D_{KL}(P \parallel Q) = \sum_{x} P(x) \ln(P(x)/Q(x))$，不具對稱性。</p>
          </li>
          <li><strong>隱私安全計算技術</strong>：
            <ul>
              <li><strong>同態加密 (Homomorphic Encryption, HE)</strong>：允許第三方直接在<strong>密文</strong>上進行加法、乘法等數學運算。運算結果在本地用私鑰解密後，與直接在明文上進行相同運算的結果完全一致，實現數據「可用不可見」。</li>
              <li><strong>差分隱私 (Differential Privacy, DP)</strong>：在統計查詢結果中加入數學上精確計算的隨機噪聲，確保個別數據主體的加入或退出不會顯著影響統計結果，強效防範「連結攻擊 (Linkage Attack)」。</li>
            </ul>
          </li>
        </ul>
        `
      }
    ]
  }
];
