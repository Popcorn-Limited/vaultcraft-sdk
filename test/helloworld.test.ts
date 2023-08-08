function helloWorld(): string {
    return "Hello World!";
}

test("hello world", () => {
    expect(helloWorld()).toBe("Hello World!");
});