declare namespace NodeJS {
  interface Global {
    window: {
      location: {
        pathname: string;
      };
    };
  }
}
