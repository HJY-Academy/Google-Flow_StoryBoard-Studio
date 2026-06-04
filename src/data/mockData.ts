export interface Scene {
  scene_number: number;
  image_url: string;
  script_line: string;
  word_order_question: string;
  word_order_answer: string[];
}

export const mockHaramieStory: Scene[] = [
  {
    scene_number: 1,
    image_url: "/assets/haramie_scene1.png",
    script_line: "마스코트 하람이가 영어 공부를 시작합니다.",
    word_order_question: "Haramie starts studying English",
    word_order_answer: ["Haramie", "starts", "studying", "English"]
  },
  {
    scene_number: 2,
    image_url: "/assets/haramie_scene2.png",
    script_line: "하람이가 주아에게 어순 배열 규칙을 신나게 설명합니다.",
    word_order_question: "Haramie explains word order rules",
    word_order_answer: ["Haramie", "explains", "word", "order", "rules"]
  },
  {
    scene_number: 3,
    image_url: "/assets/haramie_scene3.png",
    script_line: "마침내 주아가 영어 시험에서 백점을 맞고 웃습니다.",
    word_order_question: "Jua gets a perfect score",
    word_order_answer: ["Jua", "gets", "a", "perfect", "score"]
  }
];
