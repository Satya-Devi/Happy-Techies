import { storyblokEditable } from "@storyblok/react/rsc";

export const Hero = (params: any) => {
  return (
    <section {...storyblokEditable(params.blok)}>
      <h1>{params.blok.headline}</h1>
      <p>{params.blok.content}</p>
    </section>
  );
};
