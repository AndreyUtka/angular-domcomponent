describe("angular dom component", function() {
    beforeEach(function() {
        angular.module("app", []);
        angular.mock.inject(function($compile) {
            this.$compile = $compile;
        });
    });

    it("should be defined domComponent in angular module", function() {
        expect(angular.module("app").domComponent).toBeDefined();
    });

    it("should be create directive", function() {
        var myModule = angular.module("app"),
            invokeQueue = null;

        myModule.domComponent('a', 'aa');
        invokeQueue = myModule._invokeQueue;

        expect(invokeQueue.length).toBe(1);
        expect(invokeQueue[0][0]).toBe("$compileProvider");
        expect(invokeQueue[0][1]).toBe("directive");
        expect(invokeQueue[0][2][0]).toBe("a");
    });
});