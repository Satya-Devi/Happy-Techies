import { Container, Image } from "@mantine/core";
import {
  ISbNode,
  RichTextSchema,
  renderRichText,
  storyblokEditable,
} from "@storyblok/react/rsc";

export const Article = (props: any) => {
  return (
    <main {...storyblokEditable(props.blok)}>
      <Container size="md" my="xl">
        <Image
          radius="lg"
          src={props.blok.image.filename}
          alt={props.blok.image.alt}
          height={500}
        />
        <div
          style={{
            letterSpacing: "-0.01em",
            margin: "20px 0",
          }}
          dangerouslySetInnerHTML={{
            __html: renderRichText(props.blok.body, {
              schema: {
                ...RichTextSchema,
                nodes: {
                  ...RichTextSchema.nodes,
                  image: (node: ISbNode) => ({
                    singleTag: [
                      {
                        tag: "img",
                        attrs: {
                          src: `${node.attrs.src}/m/1504x0/filters:quality(75)`,
                          alt: node.attrs.alt,
                          loading: "lazy",
                          width: node.attrs.src.split("/")[5].split("x")[0],
                          height: node.attrs.src.split("/")[5].split("x")[1],
                        },
                      },
                    ],
                  }),
                },
              },
            }),
          }}
        ></div>
      </Container>
    </main>
  );
};
