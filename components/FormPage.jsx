import React from 'react'
import { Pressable, Text, TextInput, View, StyleSheet } from 'react-native'
/* ==== CUSTOM ==== */
import { styles } from '../utilities/style'

const FormPage = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    keyboardType,
    isValid,
    previousPage,
    nextPage,
    submit,
    disabled,
    currentPage,
    totalPage,
}) => {
    

    return (
        <View id={id} style={s.page} key={id}>
            <View style={s.pageContainer}>
                <Text style={s.text}>{label}</Text>
                <TextInput
                style={s.inputBox}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                keyboardType={keyboardType}
                />
            </View>
            <View style={s.pageIndicator}>
            {[...Array(totalPage)].map((_, index) => (
                <View key={index} style={[s.pageDot, index + 1 === currentPage ? s.pageDotActive : null]} />
            ))}
            </View>
            <View style={s.buttons}>
                {previousPage && (
                    <Pressable style={s.halfBtn} onPress={previousPage}>
                        <Text style={s.btnText}>Back</Text>
                    </Pressable>
                )}
                <Pressable
                    style={[s.halfBtn, isValid ? "" : s.btnDisabled]}
                    onPress={nextPage || submit}
                    disabled={!isValid || disabled}
                >
                    <Text style={s.btnText}>
                        {id === totalPage.toString() ? "Submit" : "Next"}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

export default FormPage

const s = StyleSheet.create({
    page: {
        justifyContent: "center",
    },
    pageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputBox: {
        borderColor: "#EDEFEE",
        backgroundColor: "#EDEFEE",
        alignSelf: "stretch",
        height: 50,
        margin: 18,
        borderWidth: 1,
        padding: 10,
        fontSize: 20,
        borderRadius: 9,
        fontFamily: styles.fontFamily.Karla_Medium,
    },
    pageIndicator: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginBottom: 20,
    },
    pageDot: {
        backgroundColor: "#67788a",
        marginHorizontal: 10,
        borderRadius: 11,
        width: styles.commonDimensions.width_22,
        height: styles.commonDimensions.height_22,
    },
    pageDotActive: {
        backgroundColor: styles.colorPalette.button_primary,
        width: styles.commonDimensions.width_22,
        height: styles.commonDimensions.height_22,
        borderRadius: 11,
    },
    halfBtn: {
        flex: 1,
        marginRight: 18,
        padding: 10,
        borderRadius: 10,
        alignSelf: "stretch",
        borderWidth: 1,
        borderColor: styles.colorPalette.button_primary,
        backgroundColor: styles.colorPalette.button_primary,
    },
    btnText: {
        fontSize: styles.textStyle.font_size_xl,
        color: "#333",
        fontFamily: styles.fontFamily.Karla_Bold,
        alignSelf: "center",
    },
})
