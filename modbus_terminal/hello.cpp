#include <iostream>
#include <conio.h>
#include <cstdlib>

int main() {
    // 設定控制台編碼為 UTF-8 (65001) 以正常顯示中文
    system("chcp 65001 > nul");

    // 顯示 Hello
    std::cout << "Hello!" << std::endl;

    // 提示使用者按下任一鍵離開
    std::cout << "請按下任一鍵以離開..." << std::endl;

    // 等待使用者按下任一鍵
    _getch();

    return 0;
}
