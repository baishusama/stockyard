import { DependencyInjectionBetweenServicesPage } from './app.po';

describe('dependency-injection-between-services App', function() {
  let page: DependencyInjectionBetweenServicesPage;

  beforeEach(() => {
    page = new DependencyInjectionBetweenServicesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
