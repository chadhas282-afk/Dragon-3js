import React, {
    useEffect,
    useRef,
    useMemo,
    useState,
    } from 'react'

import * as THREE from 'three'

import { useThree, useFrame } from '@react-three/fiber'

import {
    useGLTF,
    useTexture,
    useAnimations,
    ContactShadows,
    Sparkles,
} from '@react-three/drei'

import {
    EffectComposer,
    Bloom,
    ChromaticAberration,
    Noise,
    Vignette,
    } from '@react-three/postprocessing'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger)

const MODEL_PATH = '/models/model.glb'
const NORMAL_MAP_PATH = '/MI_M_B_44_Qishilong_body02_2_Inst_normal.png'

const MATCAP_PATHS = [
    '/matcap/mat-1.png', '/matcap/mat-2.png', '/matcap/mat-3.png', '/matcap/mat-4.png',
    '/matcap/mat-5.png', '/matcap/mat-6.png', '/matcap/mat-7.png', '/matcap/mat-8.png',
    '/matcap/mat-9.png', '/matcap/mat-10.png', '/matcap/mat-11.png', '/matcap/mat-12.png',
    '/matcap/mat-13.png', '/matcap/mat-14.png', '/matcap/mat-15.png', '/matcap/mat-16.png',
    '/matcap/mat-17.png', '/matcap/mat-18.png', '/matcap/mat-19.png', '/matcap/mat-20.png',
]

useGLTF.preload(MODEL_PATH)
useTexture.preload(NORMAL_MAP_PATH)
MATCAP_PATHS.forEach((path) => useTexture.preload(path))

const Dragon = () => {
    const group = useRef(null)
    const dragonModel = useRef(null)
    const [lightTint, setLightTint] = useState({ primary: '#ffffff', secondary: '#88bbff' })

    const shaderUniforms = useRef({
         uMatcapTexture1: { value: null },
        uMatcapTexture2: { value: null },
        uProgress: { value: 1.0 },
    })

    const { camera, gl } = useThree()
    const model = useGLTF(MODEL_PATH)
    dragonModel.current = model

    const { actions } = useAnimations(model.animations, model.scene)

    useEffect(() => {
        camera.position.set(40, 0, 40)
        gl.toneMapping = THREE.ReinhardToneMapping
        gl.toneMappingExposure = 1.2
         gl.outputColorSpace = THREE.SRGBColorSpace
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }, [camera, gl])

    useEffect(() => {
        const attackAction = actions?.['Qishilong_attack01']
        if (!attackAction) return
        attackAction.reset()
        attackAction.play()
    }, [actions])

    const normalMaps = useTexture([NORMAL_MAP_PATH])
    const normalMap = normalMaps[0]

    useEffect(() => {
        if (!normalMap) return
        normalMap.flipY = false
        normalMap.colorSpace = THREE.NoColorSpace
        normalMap.needsUpdate = true
    }, [normalMap])

    const matcaps = useTexture(MATCAP_PATHS)

    useEffect(() => {
        matcaps.forEach((texture) => {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.generateMipmaps = true
            texture.minFilter = THREE.LinearMipmapLinearFilter
            texture.needsUpdate = true
        })
        }, [matcaps])

    const [, mat2, , , , , , mat8, , , , mat12, mat13, mat14, mat15, , , , mat19] = matcaps

    useEffect(() => {
         if (!mat2) return
        shaderUniforms.current.uMatcapTexture1.value = mat2
        shaderUniforms.current.uMatcapTexture2.value = mat2
        shaderUniforms.current.uProgress.value = 1.0
    }, [mat2])

    const dragonMaterial = useMemo(() => {
        if (!normalMap || !mat2) return null

        const mat = new THREE.MeshMatcapMaterial({ normalMap, matcap: mat2 })

        mat.onBeforeCompile = (shader) => {
            shader.uniforms.uMatcapTexture1 = shaderUniforms.current.uMatcapTexture1
            shader.uniforms.uMatcapTexture2 = shaderUniforms.current.uMatcapTexture2
            shader.uniforms.uProgress = shaderUniforms.current.uProgress

            shader.fragmentShader = shader.fragmentShader.replace(
                'void main() {',
                `
                uniform sampler2D uMatcapTexture1;
                uniform sampler2D uMatcapTexture2;
                uniform float uProgress;

                void main() {
                `
                 )

            shader.fragmentShader = shader.fragmentShader.replace(
                'vec4 matcapColor = texture2D( matcap, uv );',
                `
                vec4 matcapColor1 = texture2D(uMatcapTexture1, uv);
                vec4 matcapColor2 = texture2D(uMatcapTexture2, uv);

                float sweep = uv.x + uv.y * 0.5;
                float width = 0.18;
                float p = uProgress * (1.0 + width * 2.0) - width;
                float factor = smoothstep(p, p + width, sweep);

                float edge = smoothstep(p - 0.03, p, sweep) * (1.0 - smoothstep(p, p + 0.03, sweep));
                vec3 glow = vec3(1.2, 0.6, 0.2) * edge * 3.0;

                vec4 matcapColor = mix(matcapColor1, matcapColor2, factor);
                matcapColor.rgb += glow;
                `
            )
            }

        mat.needsUpdate = true
        return mat
    }, [normalMap, mat2])

    useFrame(() => {
        if (dragonMaterial && dragonMaterial.userData.shader) {
            dragonMaterial.userData.shader.uniforms.uProgress.value = shaderUniforms.current.uProgress.value
        }
         })

    useEffect(() => {
        if (!model?.scene || !dragonMaterial) return

        model.scene.traverse((child) => {
            if (!child.isMesh) return
            child.material = dragonMaterial
            
            child.material.onBeforeCompile = (shader) => {
                child.material.userData.shader = shader
                shader.uniforms.uMatcapTexture1 = shaderUniforms.current.uMatcapTexture1
                shader.uniforms.uMatcapTexture2 = shaderUniforms.current.uMatcapTexture2
                shader.uniforms.uProgress = shaderUniforms.current.uProgress

                shader.fragmentShader = shader.fragmentShader.replace(
                    'void main() {',
                    `
                    uniform sampler2D uMatcapTexture1;
                    uniform sampler2D uMatcapTexture2;
                    uniform float uProgress;

                    void main() {
                    `
                )

                shader.fragmentShader = shader.fragmentShader.replace(
                    'vec4 matcapColor = texture2D( matcap, uv );',
                    `
                    vec4 matcapColor1 = texture2D(uMatcapTexture1, uv);