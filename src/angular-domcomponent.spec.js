describe("angular dom component", function() {
    var _scope, _compile,
        instanceConstructorSpy = jasmine.createSpy('instanceConstructorSpy');

    function createEl(html) {
        var elem, compiledElem;
        elem = angular.element(html);
        compiledElem = _compile(elem)(_scope);
        _scope.$digest();
        return compiledElem;
    }

    var withDefaultComponent = (function() {
        function withDefault(scope, $element, $attrs) {
            instanceConstructorSpy(scope, $element, $attrs);
        }
        withDefault.restrict = "E";
        withDefault.template = "<div>far boo</div>";
        return withDefault;
    } ());

    angular.module('app', [])
        .domComponent('withDefault', withDefaultComponent);

    beforeEach(module('app'));

    beforeEach(inject(function($compile, $rootScope) {
        _scope = $rootScope.$new();
        _compile = $compile;
    }));

    it("should be defined domComponent in angular module", function() {
        expect(angular.module("app").domComponent).toBeDefined();
    });

    it("should be create directive", function() {
        var myModule = angular.module("tmp", []),
            invokeQueue = null;

        myModule.domComponent('a', 'aa');
        invokeQueue = myModule._invokeQueue;

        expect(invokeQueue.length).toBe(1);
        expect(invokeQueue[0][0]).toBe("$compileProvider");
        expect(invokeQueue[0][1]).toBe("directive");
        expect(invokeQueue[0][2][0]).toBe("a");
    });

    it("should be invoke component instance with the correct default list of dependencies", function() {
        var el = createEl("<with-default></with-default>"),
            attr = { $attr: {}, $$element: el };

        expect(instanceConstructorSpy).toHaveBeenCalledWith(_scope, el, attr);
    })
});
