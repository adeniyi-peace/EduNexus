interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
}

export function SectionHeader({ title, subtitle, centered }: SectionHeaderProps) {
    return (
        <div className={`max-w-3xl mb-12 ${centered ? "mx-auto text-center" : ""}`}>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg text-base-content/60 leading-relaxed">
                    {subtitle}
                </p>
            )}
            <div className={`h-1.5 w-20 bg-primary mt-6 ${centered ? "mx-auto" : ""}`} />
        </div>
    );
}