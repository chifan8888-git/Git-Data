import time
import json
from visio_controller import VisioController

def simulate_mcp_operation():
    """
    這是一個模擬 MCP Host (如 Claude Desktop) 的程式。
    它會傳送一個「結構化指令集」給 Controller (MCP Server)。
    """
    print("=== MCP 核心概念練習：自動化控制軟體 ===")
    
    # 1. 模擬 AI 產生的指令集 (JSON 格式)
    mcp_request = {
        "operation": "build_flowchart",
        "data": {
            "nodes": [
                {"id": "n1", "text": "1. 概念發想", "pos": (2, 8)},
                {"id": "n2", "text": "2. 可行性評估", "pos": (2, 6.5)},
                {"id": "n3", "text": "3. 產品設計", "pos": (2, 5)},
                {"id": "n4", "text": "4. 測試驗證", "pos": (2, 3.5)},
                {"id": "n5", "text": "5. 正式上市", "pos": (2, 2)}
            ],
            "connections": [
                ("n1", "n2"), ("n2", "n3"), ("n3", "n4"), ("n4", "n5")
            ]
        }
    }

    # 2. 模擬 MCP Server (Controller) 接收並轉換指令
    print(f"[HOST] 正在發送請求: {mcp_request['operation']}")
    
    ctrl = VisioController()
    if not ctrl.start_visio():
        return

    # 3. 遍歷指令並呼叫工具
    data = mcp_request["data"]
    
    # 執行「新增形狀」工具
    for node in data["nodes"]:
        ctrl.add_shape(node["id"], node["text"], node["pos"][0], node["pos"][1])
        time.sleep(0.5) # 模擬網路延遲，讓你方便觀察 Visio 的變化

    # 執行「建立連線」工具
    for start, end in data["connections"]:
        ctrl.connect_shapes(start, end)
        time.sleep(0.3)

    # 4. 完成
    ctrl.finalize()
    print("\n[SUCCESS] 自動化任務已完成！請切換到 Visio 視窗查看結果。")

if __name__ == "__main__":
    simulate_mcp_operation()
