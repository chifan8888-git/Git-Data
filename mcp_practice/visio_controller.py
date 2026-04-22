import win32com.client
import os

class VisioController:
    """
    這是一個模擬 MCP Server 的工具類別 (Tool Class)。
    它封裝了對 Visio 軟體的具體控制邏輯。
    """
    def __init__(self):
        self.visio = None
        self.doc = None
        self.page = None
        self.shapes = {}

    def start_visio(self):
        """啟動或連接到 Visio 實體"""
        try:
            self.visio = win32com.client.Dispatch("Visio.Application")
            self.visio.Visible = True
            # 建立一個新文件 (基本流程圖範本)
            self.doc = self.visio.Documents.Add("")
            self.page = self.visio.ActivePage
            print("[INFO] Visio 已成功啟動並建立新文件。")
            return True
        except Exception as e:
            print(f"[ERROR] 無法啟動 Visio: {e}")
            return False

    def add_shape(self, name, text, x, y):
        """
        在指定位置新增一個形狀 (模擬 MCP Tool: add_shape)
        - x, y 是座標 (英吋)
        """
        if not self.page:
            return False
        
        # 繪製一個矩形作為節點 (2 = 矩形)
        shape = self.page.DrawRectangle(x, y, x + 1.5, y - 0.8)
        shape.Text = text
        
        # 設定綠色背景 (模擬色碼控制)
        shape.Cells("FillForegnd").Formula = "RGB(144, 238, 144)" # 淺綠色
        
        self.shapes[name] = shape
        print(f"[TOOL] 已新增節點: {name} ('{text}')，背景已設為綠色。")
        return shape

    def connect_shapes(self, from_name, to_name):
        """
        在兩個形狀之間建立連線 (模擬 MCP Tool: connect_nodes)
        """
        if from_name not in self.shapes or to_name not in self.shapes:
            print(f"[ERROR] 找不到節點: {from_name} 或 {to_name}")
            return False

        shape_from = self.shapes[from_name]
        shape_to = self.shapes[to_name]

        # 使用 Visio 的自動連線工具
        connector = self.page.Drop(self.visio.Application.ConnectorToolDataObject, 0, 0)
        connector.Cells("BeginX").GlueTo(shape_from.Cells("PinX"))
        connector.Cells("EndX").GlueTo(shape_to.Cells("PinX"))
        print(f"[TOOL] 已建立連線: {from_name} -> {to_name}")
        return True

    def finalize(self):
        """排版整合"""
        if self.page:
            # 執行 Visio 的自動排版功能
            self.page.Layout()
            print("[INFO] 流程圖排版完成。")
