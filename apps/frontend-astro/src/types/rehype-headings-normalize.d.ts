interface Options {
  minimumLevel?: number;
}

declare module "rehype-headings-normalize" {
  export default function (options: Options);
}
