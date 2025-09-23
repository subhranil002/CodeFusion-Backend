const generateCodeTemplate = (languageId: number) => {
    switch (languageId) {
        case 110: // C
            return '/* Love From Subhranil ❤️ */\n\n#include <stdio.h>\nint main(){\n\tint a,b;\n\tscanf("%d %d", &a, &b);\n\tprintf("%d", a+b);\n\treturn 0;\n}\n';
        case 105: // C++
            return "/* Love From Subhranil ❤️ */\n\n#include <iostream>\nint main(){\n\tint a,b;\n\tstd::cin>>a>>b;\n\tstd::cout<<a+b;\n\treturn 0;\n}\n";
        case 107: // Go
            return '/* Love From Subhranil ❤️ */\n\npackage main\nimport "fmt"\nfunc main(){\n\tvar a,b int\n\tfmt.Scan(&a,&b)\n\tfmt.Print(a+b)\n}\n';
        case 91: // Java
            return "/* Love From Subhranil ❤️ */\n\nimport java.util.*;\nclass Main{\n\tpublic static void main(String[] args){\n\t\tScanner s=new Scanner(System.in);\n\t\tint a=s.nextInt();\n\t\tint b=s.nextInt();\n\t\tSystem.out.print(a+b);\n\t}\n}\n";
        case 102: // JavaScript
            return "/* Love From Subhranil ❤️ */\n\nlet a = 5;\nlet b = 7;\nconsole.log(a+b);\n";
        case 111: // Kotlin
            return "/* Love From Subhranil ❤️ */\n\nfun main(){\n\tval a=readLine()!!.toInt()\n\tval b=readLine()!!.toInt()\n\tprint(a+b)\n}\n";
        case 98: // PHP
            return "<?php\n// Love From Subhranil ❤️\n$a=5;\n$b=7;\necho $a+$b;\n?>\n";
        case 109: // Python
            return "# Love From Subhranil ❤️\n\na=int(input())\nb=int(input())\nprint(a+b)\n";
        case 72: // Ruby
            return "# Love From Subhranil ❤️\n\na,b = 5,7\nputs a+b\n";
        case 108: // Rust
            return '/* Love From Subhranil ❤️ */\n\nuse std::io;\nfn main(){\n\tlet mut s=String::new();\n\tio::stdin().read_line(&mut s).unwrap();\n\tlet n: Vec<i32>=s.trim().split_whitespace().map(|x|x.parse().unwrap()).collect();\n\tprintln!("{}",n[0]+n[1]);\n}\n';
        case 46: // Bash
            return "# Love From Subhranil ❤️\n\nread a\nread b\necho $((a+b))\n";
        case 101: // TypeScript
            return "/* Love From Subhranil ❤️ */\n\nlet a: number = 5;\nlet b: number = 7;\nconsole.log(a + b);\n";
        default:
            return "/* Love From Subhranil ❤️ */\n\n// Welcome to CodeFusion!\n";
    }
};

export default generateCodeTemplate;
