import { Router } from "vue-router";

export const goTo = (router: Router, location: string) => {
  router.push(location).catch((err) => {
    if (err._name === "NavigationDuplicated") {
      // console.log('it is in page')
    }
  });
};
