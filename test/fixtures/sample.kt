// Kotlin 单行注释
/* 块注释 */
fun add(a: Int, b: Int): Int {
    val msg = "hi"
    val raw = """multi
        line"""
    return a + b
}

fun main() {
    println(add(1, 2))
}