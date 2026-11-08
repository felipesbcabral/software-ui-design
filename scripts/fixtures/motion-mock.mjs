// Mock for the interruption pair: the trigger heads to "Mês", then redirects to "Semana" mid-move (300 ms of wall time,
// about 75 ms of product time at the 0.25x recording rate).
export const states = {
  default: {
    trigger: async ({ page }) => {
      await page.click('#mes');
      await page.waitForTimeout(300);
      await page.click('#semana');
    },
  },
};
export default async function () {}
