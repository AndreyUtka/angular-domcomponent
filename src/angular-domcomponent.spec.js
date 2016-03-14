describe("angular dom component", function() {
    var _scope, _compile, _$http,
        defaultConstructorSpy = jasmine.createSpy('instanceConstructorSpy'),
        httpConstructorSpy = jasmine.createSpy('httpConstructorSpy');

    function createEl(html) {
        var elem, compiledElem;
        elem = angular.element(html);
        compiledElem = _compile(elem)(_scope);
        _scope.$digest();
        return compiledElem;
    }

    var withDefaultComponent = (function() {
        function withDefault(scope, $element, $attrs) {
            defaultConstructorSpy(scope, $element, $attrs);
        }
        withDefault.restrict = "E";
        withDefault.selector = "withDefault";
        withDefault.template = "<div>far boo</div>";
        return withDefault;
    } ());


    var withHttpComponent = (function() {
        function withHttpComponent(scope, $element, $attrs, $ctrl, $transclude, $http) {
            httpConstructorSpy(scope, $element, $attrs, $transclude, $http);
        }
        withHttpComponent.restrict = "E";
        withHttpComponent.selector = "withHttp";
        withHttpComponent.template = "<div>far boo</div>";
        withHttpComponent.$inject = ["$scope", "$element", "$attrs", "$controller", "$transclude", "$http"];
        return withHttpComponent;
    } ());

    var emptyComponent = (function() {
        function emptyComponent() { }
        emptyComponent.selector = "empty";
        return emptyComponent;
    } ());

    angular.module('app', [])
        .domComponent(emptyComponent)
        .domComponent(withDefaultComponent)
        .domComponent(withHttpComponent);

    beforeEach(module('app'));

    beforeEach(inject(function($compile, $rootScope, $http) {
        _scope = $rootScope.$new();
        _compile = $compile;
        _$http = $http;
    }));

    it("should be defined domComponent in angular module", function() {
        expect(angular.module("app").domComponent).toBeDefined();
    });

    it("should be create directive", function() {
        var myModule = angular.module("tmp", []),
            invokeQueue = null;

        myModule.domComponent(emptyComponent);
        invokeQueue = myModule._invokeQueue;

        expect(invokeQueue.length).toBe(1);
        expect(invokeQueue[0][0]).toBe("$compileProvider");
        expect(invokeQueue[0][1]).toBe("directive");
        expect(invokeQueue[0][2][0]).toBe("empty");
    });

    it("should be invoke component instance with the correct default list of dependencies", function() {
        var el = createEl("<with-default></with-default>"),
            attr = { $attr: {}, $$element: el };

        expect(defaultConstructorSpy).toHaveBeenCalledWith(undefined, undefined, undefined);
    })

    it("should be invoke component instance with http inject service", function() {
        var el = createEl("<with-http></with-http>"),
            attr = { $attr: {}, $$element: el };

        expect(httpConstructorSpy).toHaveBeenCalledWith(_scope, el, attr, undefined, _$http);
    })
});
