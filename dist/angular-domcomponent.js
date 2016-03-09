/*! angular-domcomponent v0.0.2 | (c) 2016 @andreyutka | https://github.com/AndreyUtka/angular-domcomponent#readme */
(function() {

    var ng = angular.module;

    function identifierForController(controller, ident) {
        if (ident && typeof ident === 'string') {
            return ident;
        }
        if (typeof controller === 'string') {
            var match = /^(\S+)(\s+as\s+(\w+))?$/.exec(controller);
            if (match) {
                return match[3];
            }
        }
    }

    function module() {

        var moduleInstance = ng.apply(this, arguments);

        function domComponent(name, instance) {
            function factory($injector) {
                function makeComponentInstanceWithDI() {
                    var instanceWithDi = [
                        'scope',
                        '$element',
                        '$attrs',
                        '$controller',
                        '$transclude'
                    ];
                    instanceWithDi = instanceWithDi.concat(instance.$inject);
                    instanceWithDi.push(instance);
                    return function(scope, el, attrs, $controller, $transclude) {
                        return $injector.invoke(instanceWithDi, this, {
                            scope: scope,
                            $element: el,
                            $attrs: attrs,
                            $controller: $controller,
                            $transclude: $transclude
                        });
                    };
                }

                return {
                    controller: instance.controller || function() { },
                    controllerAs: identifierForController(instance.controller) || instance.controllerAs || '$ctrl',
                    template: instance.template,
                    transclude: instance.transclude,
                    scope: instance.scope,
                    bindToController: instance.bindToController || {},
                    restrict: instance.restrict,
                    require: instance.require,
                    link: makeComponentInstanceWithDI()
                };
            }

            // Copy any annotation properties (starting with $) over to the factory function
            // These could be used by libraries such as the new component router
            for (var key in instance) {
                if (key.charAt(0) === '$') {
                    factory[key] = instance[key];
                }
            }
            factory.$inject = ['$injector'];

            return moduleInstance.directive(name, factory);
        }

        moduleInstance.domComponent = domComponent;

        return moduleInstance;

    }

    angular.module = module;
})();
