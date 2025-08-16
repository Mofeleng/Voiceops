
export const WidgetHeader = (
    {
        children,
        className
    }: {
        children: React.ReactNode,
        className?: string
    }
) => {
    return (
        <header className="bg-gradient-to-b from-primary to-[#009222] p-4 text-primary-foreground">
            { children }
        </header>
    )
}