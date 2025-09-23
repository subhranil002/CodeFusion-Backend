const generateCodeTemplate = (languageId: number) => {
    switch (languageId) {
        case 110:
            return '// Love From Subhranil ❤️\n\n#include <stdio.h>\nint main(){\n\tint a,b;\n\tscanf("%d %d", &a, &b);\n\tprintf("%d", a+b);\n\treturn 0;\n}\n';
        case 105:
            return "// Love From Subhranil ❤️\n\n#include <iostream>\nint main(){\n\tint a,b;\n\tstd::cin>>a>>b;\n\tstd::cout<<a+b;\n\treturn 0;\n}\n";
        case 107:
            return '// Love From Subhranil ❤️\n\npackage main\nimport "fmt"\nfunc main(){\n\tvar a,b int\n\tfmt.Scan(&a,&b)\n\tfmt.Print(a+b)\n}\n';
        case 91:
            return "// Love From Subhranil ❤️\n\nimport java.util.*;\nclass Main{\n\tpublic static void main(String[] args){\n\t\tScanner s=new Scanner(System.in);\n\t\tint a=s.nextInt();\n\t\tint b=s.nextInt();\n\t\tSystem.out.print(a+b);\n\t}\n}\n";
        case 102:
            return "// Love From Subhranil ❤️\n\nlet a = 5;\nlet b = 7;\nconsole.log(a+b);\n";
        case 111:
            return "// Love From Subhranil ❤️\n\nfun main(){\n\tval a=readLine()!!.toInt()\n\tval b=readLine()!!.toInt()\n\tprint(a+b)\n}\n";
        case 98:
            return "// Love From Subhranil ❤️\n\n<?php\n$a=5;\n$b=7;\necho $a+$b;\n?>\n";
        case 109:
            return "// Love From Subhranil ❤️\n\na=int(input())\nb=int(input())\nprint(a+b)\n";
        case 72:
            return "// Love From Subhranil ❤️\n\na,b = 5,7\nputs a+b\n";
        case 108:
            return '// Love From Subhranil ❤️\nuse std::io;\nfn main(){let mut s=String::new();io::stdin().read_line(&mut s).unwrap();let n: Vec<i32>=s.trim().split_whitespace().map(|x|x.parse().unwrap()).collect();println!("{}",n[0]+n[1]);}';
        case 46:
            return "// Love From Subhranil ❤️\n\nread a\nread b\necho $((a+b))\n";
        case 101:
            return "// Love From Subhranil ❤️\n\nlet a: number = 5;\nlet b: number = 7;\nconsole.log(a + b);\n";
        default:
            return "// Love From Subhranil ❤️\n\n// Welcome to CodeFusion!\n";
    }
};

export default generateCodeTemplate;
