import element3 from 'element-plus'
import { ButtonConfigContext, MessageConfigContext } from 'element-plus/lib/components'
import { Language } from 'element-plus/lib/locale'
import { ExperimentalFeatures } from 'element-plus/lib/tokens'
import { BuildPropReturn, PropWrapper } from 'element-plus/lib/utils'
import 'element-plus/theme-chalk/index.css'
import { App, ExtractPropTypes } from 'vue'
export default function (app: { use: (arg0: { version: string; install: (app: App<any>, options?: Partial<ExtractPropTypes<{ readonly a11y: BuildPropReturn<BooleanConstructor, true, unknown, unknown, unknown>; readonly locale: BuildPropReturn<PropWrapper<Language>, unknown, unknown, unknown, unknown>; readonly size: BuildPropReturn<StringConstructor, "", unknown, "" | "default" | "small" | "large", unknown>; readonly button: BuildPropReturn<PropWrapper<ButtonConfigContext>, unknown, unknown, unknown, unknown>; readonly experimentalFeatures: BuildPropReturn<PropWrapper<ExperimentalFeatures>, unknown, unknown, unknown, unknown>; readonly keyboardNavigation: BuildPropReturn<BooleanConstructor, true, unknown, unknown, unknown>; readonly message: BuildPropReturn<PropWrapper<MessageConfigContext>, unknown, unknown, unknown, unknown>; readonly zIndex: BuildPropReturn<NumberConstructor, unknown, unknown, unknown, unknown>; readonly namespace: BuildPropReturn<StringConstructor, "el", unknown, unknown, unknown> }>> | undefined) => void }) => void }) {
    app.use(element3)
}