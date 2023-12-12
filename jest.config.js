module.exports = {
    "roots": [
      "<rootDir>/src" // TypeScript 소스 코드가 위치한 디렉토리를 지정합니다.
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest" // TypeScript 파일을 ts-jest를 통해 컴파일합니다.
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$", // 테스트 파일의 위치와 패턴을 지정합니다.
    "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"] // 모듈로 인식할 파일의 확장자를 지정합니다.
  }
  