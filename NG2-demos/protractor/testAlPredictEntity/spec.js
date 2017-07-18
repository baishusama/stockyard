// spec.js
describe('Protractor App', function() {
    it('should have a title', function() {
        browser.get('http://127.0.0.1:8000/web/admin/dist/index.html');

        var EC = protractor.ExpectedConditions;
        var toastr = element(by.id('toast-container'));

        element.all(by.buttonText('预测实体')).first().click();
        browser.wait(EC.presenceOf(toastr), 1500);

        var toastrMsg = toastr.element(by.css('.toast-title')).getText();
        console.log(toastrMsg);
        browser.pause();

        expect(toastrMsg).toEqual('entity 预测成功!');

        // expect(browser.getTitle()).toEqual('Admin');
    });
});
