interface HyperlinkComponentProps {
    href: string;
    content: string;
    classNameProps?: string;
}

const HyperlinkComponent = ({ href, content, classNameProps }: HyperlinkComponentProps) => {
    return (
        <>
            <a
                href={href}
                className={
                    classNameProps ? classNameProps : 'text-sm text-gray-600 inline-block mt-4'
                }
            >
                {content}
            </a>
        </>
    );
};

export default HyperlinkComponent;
