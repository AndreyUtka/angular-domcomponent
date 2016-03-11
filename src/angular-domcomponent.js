
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'angular-domcomponent';
}

(function() {
    var ng = angular.module;
    /**
     * @param {string} controller - controller name
     * @param {string} ident - ident
     * @return {string} valid controller name
     */
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
    /**
     * DOM component module
     * @return {angular.Module} - angular module with DOM component module.
     */
    function module() {
        var moduleInstance = ng.apply(this, arguments);
        /**
         * @param {string} name - DOM component name
         * @param {angular.Module.directive} instance - DOM component instance
         * @return {angular.Module} - angular module with registered directive instance.
         */
        function domComponent(name, instance) {
            /**
             * @param {auto.$injector} $injector - angular $injector
             * @return {angular.Module.directive} - directive instance.
             */
            function factory($injector) {
                /**
                 * @return {Function} - which is called from link directive function
                 */
                function makeComponentInstanceWithDI() {
                    var instanceWithDi = [
                        'scope',
                        '$element',
                        '$attrs',
                        '$controller',
                        '$transclude'
                    ];
                    if (instance.$inject && instance.$inject.length > 0) {
                        instanceWithDi = instanceWithDi.concat(instance.$inject);
                    }
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
