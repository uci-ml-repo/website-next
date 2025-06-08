import { Developer } from "./developer";

export function PreviousDevelopers() {
  return (
    <div className="divide-y">
      <Developer
        name="John Lorenzini"
        subTitle="UCI 2025"
        avatar="https://avatars.githubusercontent.com/u/71615006"
        github="johnlorenzini"
      />
      <Developer
        name="Brian Vo"
        subTitle="UCI 2023"
        avatar="https://avatars.githubusercontent.com/u/66761366"
        github="ap0nia"
      />
      <Developer
        name="Philip Truong"
        subTitle="UCI 2023"
        avatar="https://avatars.githubusercontent.com/u/71199572"
        github="ptruong0"
      />
      <Developer
        name="Daniel Jiang"
        subTitle="UCI 2021"
        avatar="https://avatars.githubusercontent.com/u/17039633"
        github="dwjiang"
      />
      <Developer
        name="Parmik Mehra"
        subTitle="UCI 2021"
        avatar="https://avatars.githubusercontent.com/u/29420490"
        github="parmikmehra"
      />
    </div>
  );
}
