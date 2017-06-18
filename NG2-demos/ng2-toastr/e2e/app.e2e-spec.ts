import { Ng2ToastrPage } from './app.po';

describe('ng2-toastr App', function() {
  let page: Ng2ToastrPage;

  beforeEach(() => {
    page = new Ng2ToastrPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
