// Go 单行注释
/* 块注释 */
package main

import "fmt"

func greet(name string) string {
    return `hi, ` + name
}

func main() {
    fmt.Println(greet("world"))
}