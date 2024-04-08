import { useColorMode } from "@docusaurus/theme-common";
import Giscus from "@giscus/react";

export default function GiscusComment() {
    const { colorMode } = useColorMode();

    return (
        <Giscus
            id="comments"
            repo="charlescyt/charlescyt.github.io"
            repoId="R_kgDOLohVEg"
            category="Comments"
            categoryId="DIC_kwDOLohVEs4Cei86"
            mapping="title"
            term="Welcome to @giscus/react component!"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={colorMode}
            lang="en"
            loading="lazy"
        />
    );
}
